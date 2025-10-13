---
title: Understand Public Key Infrastructure & Certificates
date: '2024-07-29 22:00'
categories:
  - Cryptography
  - PKI
  - Certificate
slug: /public-key-infrastructures-and-certificates
featuredImage: ./pki.png
description: Learn about about the shortcomings of public key encryption and the need for a trusted 3rd party - Certificate Authority.
---

> This article is targeted towards newcomers looking to explore the foundations of PKIs.  
> It should be treated as the first chapter of PKI 101.  
> Readers are assumed to have a basic understanding of Asymmetric Cryptography & TLS.

Public Key encryption has enabled us to establish a secure channel for communication in an untrusted environment.

If Alice wants to send confidential data to Bob, she needs to somehow obtain Bob's public key and then encrypt the message with that public key. Only Bob can decrypt the message. And likewise, Bob encrypts the message with Alice's public key, and only Alice can decrypt it. A secure communication channel is thus established.

While **confidentiality** is undoubtedly achieved with encryption, **authenticity** isn't!
Let me ask you this - how does Alice guarantee that the public key is actually Bob's?
Cuz remember, they are in a potentially compromised environment.
Who is to say that Eve - a malicious actor - didn't offer her public key to Alice claiming it to be of Bob's.

## Shortcomings of Public Key Encryption

If Alice doesn't verify that the public key is Bob's then she'll happily encrypt messages with Eve's key falsely believing that she's encrypting it for Bob.

![Diagram showing Eve intercepting Bob's public key](./pki-mitm.svg)

You see the problem we have in our hands right? Just obtaining a public key isn't sufficient.
We need a trusted entity that can tie down the public key to a certain identity.
If the trusted entity states that it is indeed Bob's public key then for all intents and purposes that is indeed Bob's public key.

![Diagram showing a trusted entity confirming Bob's key](./pki-trusted-entity.svg)

## Certificate Authority

On the web, Certificate Authorities (CA) are organizations that **aim** to be such trusted entities.

They do all the heavy lifting of verifying the identity and then issue a signed digital document called a "Certificate" which acts as proof of identity.

When an unknown actor provides us with a certificate that was signed by a CA we trust, we can mathematically verify that the certificate was indeed certified by that CA and deem the certificate valid. This eliminates a massive burden off of us in individually verifying the identity of every single public key we deal with.
We trust one (or more) CAs and then get the benefit of having the thousands/millions of public keys identified.

In our example above, Bob requests a certificate from the Trusted entity and then instead of providing a public key to Alice, he provides her with the signed certificate. Alice can then extract the public key from the certificate after verifying that the certificate is valid.

![Diagram illustrating certificate issuance and validation flow](./pki-certificate-flow.svg)

### Digital Certificates

In summary, a digital Certificate serves as a signed proof verifying that a public key belongs to a certain subject.
CAs are responsible for the creation, issuance, revocation, and management of Certificates.

#### TLS Certificates

One of the most popular types of certificate is the TLS certificate where the subject is a domain name.
A domain owner must prove

- his/her ownership over the domain
- ownership of the private key to the public key

to the CA.

Below is a TLS certificate for my website (_stripped off for brevity_).
You can see that the subject is set to `adityathebe.com`.

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

The CA that signed and issued this certificate is Cloudflare Inc.

When you visit my website over HTTPs, your browser is presented with this very certificate.
If your browser or OS trusts Cloudflare Inc as a CA then it can trust the certificate.
And if it doesn't, then it'll show a warning and probably not load the website at all.

## Trust store

Alright! So far we've established the fact that CAs are entities that facilitate authenticity in public key cryptography.

Now comes the question of which CAs to trust. Do you personally need to choose a certain bunch of CAs from a marketplace? Are there any popular well-trusted ones?

Well, good news! The operating system you use has already done that for you. Additionally, web browsers also have selected their own set of CAs that they trust. These chosen set of trusted CAs are stored in a place called **Truststore**.

If you're on Linux see the contents of `/etc/ssl/certs/ca-certificates.crt` for the list of root certificates.

```shell
cat /etc/ssl/certs/ca-certificates.crt | grep 'BEGIN CERTIFICATE' | wc -l
148
```

As you can see, on my Arch Linux machine there are `148` root certificates. On my Ubuntu server, there are `137`.

The set of CAs considered trustworthy isn't uniform across all OSs and web browsers.
For example: the CAs trusted by Google Chrome may not be trusted by Firefox and vice-versa.

But why is that? Why is one CA trustworthy to one vendor but not to another?

## Root Programs

Each vendor has outlined a set of criteria for CAs to be considered trustworthy for them. This criteria is defined in a **root program**. There are several major root programs:

- [Microsoft](https://learn.microsoft.com/en-us/security/trusted-root/program-requirements)
- [Apple](https://www.apple.com/certificateauthority/ca_program.html)
- [Chrome](https://www.chromium.org/Home/chromium-security/root-ca-policy/)
- [Mozilla](https://wiki.mozilla.org/CA)

---

## Supplementary Materials

- [How digital certificates bind owners to their public key](https://www.youtube.com/watch?v=5rT6fZUwhG8)
- [Certificates and Certificate Authority Explained](https://www.youtube.com/watch?v=x_I6Qc35PuQ)
- https://www.checktls.com/showcas.html

## Further Reading

- [Certificate Revocation](https://en.wikipedia.org/wiki/Certificate_revocation)
- [Chain of Trust](https://en.wikipedia.org/wiki/Chain_of_trust)
