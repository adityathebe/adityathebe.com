## Development on a VM

- Mt.lynch's homelab for all developerment
  https://mtlynch.io/building-a-vm-homelab/

- https://twitter.com/dhh/status/1761830698758066298

## Nixos

- Installing Nix on Proxmox failed
- https://mtlynch.io/notes/nix-first-impressions/

## Podcast

- ABS vs Podgrab vs podfetch
- lack of ios clients

## Postgres Queries

```sql
WITH statements AS (
SELECT * FROM pg_stat_statements pss
		JOIN pg_roles pr ON (userid=oid)
WHERE rolname = current_user
)
SELECT calls, total_exec_time, total_exec_time/calls as tpc, query
FROM statements
WHERE calls > 500
AND shared_blks_hit > 0
ORDER BY tpc DESC
LIMIT 10;
```

## Compiler and interpreter with Thorsten Ball

Thinking of starting the Learning interpreter in Go book by Thorsten Ball

## Vim

## Vimimum browser extension

### Vim setup series by TypeCrat

https://www.youtube.com/playlist?list=PLsz00TDipIffreIaUNk64KxTIkQaGguqn

### Vim BIndings

- Better escape was pretty cool
  https://docs.astronvim.com/basic-usage/mappings/#better-escape

- Telescope
  - <leader>gb to show all the git branches was coool
  - similary, <leader>gc to show all the git commits in telescrop
  - <leader>gt for git status shows all the files in the working are in telescope

## Preventing logictech from waking up

https://wiki.archlinux.org/title/Udev#Waking_from_suspend_with_USB_device

## Bcrypt 72 bytes password length

https://x.com/_JohnHammond/status/1762360967844012418?t=_bkMqMZVvHkr2a3fX-JYpQ&s=35
https://stackoverflow.com/a/16597402

## Unicode vs UTF8 & UTF16

## Vitess

- https://youtu.be/qTwDfW_T7Bg?si=wbNj4mTiSeQixAEc&t=2502

## Devops reimagined

- https://www.youtube.com/watch?v=zyEOYl23pd8&t=252s&pp=2AH8AZACAQ%3D%3D

## Postgres

Batch deleting in postgres with a limit. Because a big DELETE query within a transaction can lock all the rows.
