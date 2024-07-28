---
title: Understand Public Key Infrastructure & Public Key Certificates
date: '2024-07-28 23:40'
categories:
  - Cryptography
slug: /public-key-infrastructures-and-certificates
description: Setup and configure Go debugger in VS Code. Learn to create launch.json, attach to running processes, and troubleshoot common issues for effective Golang debugging in VS Code.
keywords:
  - public key certificates
  - SSL certificatese
---

<div class="table-of-contents">

1. [Certificate Authority (CA)](#certificate-authority)
2. [Root CA](#root-certificate-authorities)
3. [Intermediate CA](#intermediate-certificate-authorities)

</div>

Public Key Cryptography has enabled us to securely communicate over an insecure channel. If Alice wants to send confidential data to Bob, she needs to somehow access Bob's public key and then encrypt the message with that public key. Only Bob (or anyone with possession of the public key's private key) can decrypt the message. And likewise, Bob encrypts the message with Alice's public key and only Alice can decrypt it. A secure communication channel is thus established.

Let me ask you this - how does Alice guarantee that the public key is actually Bob's?
Cuz remember, they are in a untrustworthy insecure enviroment.

Usually, the public key is available in Bob's website.
If Alice got Bob's public key from his website then she can be assured, **to some extent**, that the public key indeed belongs to Bob.
She still cannot be 100% sure because who says the website is actually run by Bob and not some bad actor trying to impersonate him?

To verify an identity in an untrustworthy enviroment, we need a Trusted entity that can do that for us.
We fully trust that entity and then take it with 100% certainty any identity claim it provides.

If the trusted entity states that it is indeed Bob's public key then for all intents and purposes that is inded Bob's public key.

## Certificate Authority

In the web, Certificate Authorities (CA) are such trusted entities.
CAs are organizations that does this verification for us.
They are responsible for the creation, issuance, revocation, and management of Certificates.
They do all the heavy lifiting of verifying the identity and then issue a signed certificate which acts as a proof of identity.

If you need a TLS certificate for your domain, you need to prove to a trusted CA that you own the domain and then they sign & issue you a
certificate. Anyone else that trust that CA can have full confidence that the certificate is valid.

### Public Key Certificates

A digital Certificate is a signed proof that states that a public key belongs to a certain identity.
It's a way to bind a public key to a subject.

Below is a TLS certificate that claims that the public key belongs to the entity `adityathebe.com`.

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            0f:59:b4:d4:06:47:9a:1e:df:00:02:3b:48:6c:72:d5
        Signature Algorithm: ecdsa-with-SHA256
=====>  Issuer: C=US, O=Cloudflare, Inc., CN=Cloudflare Inc ECC CA-3
        Validity
            Not Before: Feb 24 00:00:00 2024 GMT
            Not After : Dec 31 23:59:59 2024 GMT
=====>  Subject: C=US, ST=California, L=San Francisco, O=Cloudflare, Inc., CN=adityathebe.com
        Subject Public Key Info:
            Public Key Algorithm: id-ecPublicKey
                Public-Key: (256 bit)
=============>    pub:
                    04:7d:2f:37:6a:b6:09:08:e4:00:18:54:6a:10:95:
                    25:c2:5a:09:a6:de:72:77:fe:ae:92:09:47:05:88:
                    de:f8:9a:89:0d:46:90:a8:ba:5b:03:69:88:32:12:
                    f5:ec:5a:42:51:7d:1e:93:60:d2:95:0d:5b:fa:fd:
                    b6:fc:64:e6:75
                ASN1 OID: prime256v1
                NIST CURVE: P-256
        X509v3 extensions:
            ...

```

This is an actual TLS certificate for my website (stripped off for brevity).
The CA that signed and issued this certificate is Cloudflare Inc.

When you visit my website over HTTPs, your browser is presented with this very certificate.
If your browser or OS trusts Cloudflare Inc as a CA then it can trust the certificate.
And if it doesn't, then it'll show a warning and probably not load the website at all.

## Root Certificate Authorities

In real world there's a heirarchy of CAs.
Root CAs sit at the very top level of the trust chain.
For an entity to become a root CA, it needs to have enough "social" trust for OSs and applications to trust it and put it in their trusted root certificate store.

Some of the few popular root CAs are

- Internet Security Research Group (ISRG)
- GlobalSign
- DigiCert

### Root Certificates

A root certificate is a self-signed Certificate issued by a Root CA. They are also known as "trust anchors" or just "roots".
A root CA can have several root certificates. Example: ISRG has 2 root certificates

- ISRG Root X1
- ISRG Root X2

There's a list of few hundred root certificates that our OS trust by default.
These certificates are preinstalled in our operating system's and web browser's Trust Store.

If you're on Linux see the contents of `/etc/ssl/certs/ca-certificates.crt` for the list of root certificates.

```shell
cat /etc/ssl/certs/ca-certificates.crt | grep 'BEGIN CERTIFICATE' | wc -l
148
```

As you can see, on my Arch Linux machine there are `148` root certificates. On my Ubuntu server, there's `137`.

The root certificates in the Trust Store of one OS may vary from another OS or from one web brower to another.
For example: the root certificates trusted by Google Chrome may not completely overlap with the ones trusted by Firefox.

### Root Programs

What's the criteria for a root certificate to be included in an OS's or web brower's trusted store? Why is it that one root certificate that exist in Chrome doesn't exist in Firefox or vice-versa.

The criteria is defined by a root program. One root program may have more strict requirements & guideliness than another and hence can have fewer root certificates in their trusted store. There are several major root programs:

- [Microsoft](https://learn.microsoft.com/en-us/security/trusted-root/program-requirements)
- [Apple](https://www.apple.com/certificateauthority/ca_program.html)
- [Chrome](https://www.chromium.org/Home/chromium-security/root-ca-policy/)
- [Mozilla](https://wiki.mozilla.org/CA)

## Intermediate Certificate Authorities

In practice, these root certificates do not directly issue certificates for the end users.

You see, to issue a signed certificate, you need the private key of the signing public key - i.e. private key for the root certificate.
If a bad actor gets hold of the root CA's private key, then they can essentially create certificates for any website in the world.

They are too valuable to be compromised. They are kept extremely safe and offline.

So then how would you receive a TLS certificate for my domain from these root certificates?

That's where Intermediate Certificate Authorities, also known as "subordinate CAs" or just "intermediates", come in.

The root CA must have intermediaries and they are the ones that remain online and issue millions of TLS certificates.
If an Intermediate CA's private key is compromised, the damage surface is relatively smaller as it's only that particular certificate that needs to be revoked.

---

## References

- https://www.thesslstore.com/blog/root-certificates-intermediate/
- https://www.checktls.com/showcas.html
- https://letsencrypt.org/certificates
- https://www.agwa.name/blog/post/roots_intermediates_and_resellers
