---
title: SET LOCAL, Stay GLOBAL - A PostgreSQL Cautionary Tale
date: '2024-12-06 22:00'
categories:
  - Postgres
  - Database
  - SQL
slug: /postgres-parameter-gotcha
description: A hidden quirk in PostgreSQL's SET LOCAL command and how it unexpectedly affected our Row Level Security policy.
---

Postgres's `SET` command allows you to modify runtime parameters or create your own custom parameters.

```sql
my_database> SET my_domain.name = 'adityathebe.com'
my_database> SHOW my_domain.name
-- +-----------------+
-- | my_domain.name  |
-- |-----------------|
-- | adityathebe.com |
-- +-----------------+
```

With the `LOCAL` option, the parameter only lives within a transaction.

```sql
my_database> BEGIN
my_database> SET my_domain.name = 'adityathebe.com'
my_database> SHOW my_domain.name
-- +-----------------+
-- | my_domain.name  |
-- |-----------------|
-- | adityathebe.com |
-- +-----------------+
my_database> ROLLBACK


my_database> SHOW my_domain.name
-- +----------------+
-- | my_domain.name |
-- |----------------|
-- |                |
-- +----------------+
```

Alternatively, you can also view the parameter using the `current_setting` function.

```sql
my_database> SET my_domain.name = 'adityathebe.com'
my_database> SELECT current_setting('my_domain.name', TRUE)
-- +-----------------+
-- | current_setting |
-- |-----------------|
-- | adityathebe.com |
-- +-----------------+
```

## Adding RLS

With this in mind, I began writing a new Row Level Security Policy.

```sql
ALTER TABLE config_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY config_items_auth ON config_items
  FOR ALL TO postgrest_api, postgrest_anon
    USING (
      CASE WHEN (
        current_setting('request.jwt.claims', TRUE) IS NULL
        OR current_setting('request.jwt.claims', TRUE)::jsonb ->> 'disable_rls' IS NOT NULL
      )
      THEN TRUE
      ELSE (
          ...
      )
      END
    );
```

The policy relies on the `request.jwt.claims` custom parameter.
If the parameter isn't set, the policy simply returns `true` - meaning the access is allowed.
Additionally, if the `request.jwt.claims` parameter is set, the policy still allows access if `disable_rls` key is present on it.

After pushing this change _(along with a whole lot of other changes in the PR...)_, our test suite went haywire.
Random tests would sporadically fail with varying errors on each run.
One commonly repeated error was this error

```txt
invalid input syntax for type json
DETAIL:  The input string ended unexpectedly.
CONTEXT:  JSON data, line 1:
```

The error came from a view using `jsonb_object_agg`.
My first guess? The RLS policy was blocking rows, causing the view to choke on empty data.
I deleted all the rows on another test db and the view worked fine however.

But let's step back a bit. I never set `request.jwt.claims` parameter so the policy could not have blocked any rows.
As far as this test is concerned, RLS policy should practically be nonexistent.

In the entire test suite, there was only one test where I had set the `request.jwt.claims` parameter.
And that test ran entirely within a transaction to avoid any side effects.
The parameter was also set with a `LOCAL` option.
Since the transaction would be rolled back the parameter should not persist outside of the transaction.
Even if the transaction was commited, the `LOCAL` option should ensure that it there's no trace of that parameter.

This is where it gets even weirder - I disabled that test and the test suite passed consistently.
This didn't make sense.
How does disabling a test that runs entirely on a rolledback transaction have any effect on other tests?
Something was escaping our carefully constructed sandbox, but what?

I also made sure that this test never runs in parallel with any other tests, but that didn't help.

## The Cause

After a bit of a research I found this weird behavior of `SET` command.
If you set a custom parameter and then unset it, it actually sets the parameter to an empty string!

Let's try querying a non existing parameter.

```sql
my_database> SHOW your_domain.name
-- unrecognized configuration parameter "your_domain.name"

my_database> SELECT current_setting('your_domain.name');
-- unrecognized configuration parameter "my_domain.namespace"
```

Both the calls error out.

If we pass in the optional second parameter to `current_setting` it returns `NULL` instead of throwing an error.

```sql
my_database> SELECT current_setting('your_domain.name', TRUE)
-- +-----------------+
-- | current_setting |
-- |-----------------|
-- | <null>          |
-- +-----------------+
```

Let's try setting the parameter in a transaction.

```sql
my_database> BEGIN
my_database> SET your_domain.name = 'example.com'
my_database> SHOW your_domain.name
-- +-------------------+
-- | your_domain.name  |
-- |-------------------|
-- |   example.com     |
-- +-------------------+
my_database> ROLLBACK
```

Now, when I query the parameter I am expecting it to behave the same way as it did before - i.e. error out or return NULL.

```sql
my_database> SHOW your_domain.name
-- +------------------+
-- | your_domain.name |
-- |------------------|
-- |                  |
-- +------------------+
```

Well there you go! A local parameter that was created inside a transaction has basically escaped and left a garbage
in the session. I couldn't find this behavior documented in the official docs.

In fact, according to this [stackoverflow answer](https://stackoverflow.com/questions/50923911/how-to-remove-configuration-parameter),
you cannot delete the parameter at all. Not with `RESET` as well. The parameter lives forever within the current
session.

So the json error I was seeing was coming from the RLS policy as `request.jwt.claim` was an invalid json - it was an empty string.
