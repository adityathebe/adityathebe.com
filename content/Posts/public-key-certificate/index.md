---
title: Understand Public Key Infrastructure & Public Key Certificates
date: '2024-07-27 23:40'
categories:
  - Cryptography
slug: /what-are-public-key-certificates
description: Setup and configure Go debugger in VS Code. Learn to create launch.json, attach to running processes, and troubleshoot common issues for effective Golang debugging in VS Code.
keywords:
  - public key certificates
  - SSL certificatese
---

> Prerequisites: basic understanding of Public Key cryptography.

A Certificate, in the world of Cryptography, is a way to bind a public key to an identity through a trusted 3rd party.

The image below shows a certificate that claims that the public key belongs to the entity `example.com`.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 115">
  <rect x="10" y="10" width="90%" height="100" fill="none" stroke="var(--blockquote-bg)" stroke-width="1"/>
  <text x="150" y="30" fill="var(--primary-text-color)" font-size="10" text-anchor="middle">Public Key Certificate</text>
  <text x="30" y="50" fill="var(--primary-text-color)" font-size="6">Subject: example.com</text>
  <text x="30" y="60" fill="var(--primary-text-color)" font-size="6">Issuer: Certificate Authority</text>
  <text x="30" y="70" fill="var(--primary-text-color)" font-size="6">Valid from: 2024-01-01</text>
  <text x="30" y="80" fill="var(--primary-text-color)" font-size="6">Valid to: 2025-01-01</text>
  <rect x="30" y="85" width="75%" height="15" fill="var(--blockquote-bg)"/>
  <text x="150" y="95" font-size="8" text-anchor="middle">Public Key: xyz</text>
</svg>

Throughout this article, we'll be using an analogy to explain the concept of Public Key Certificates.

Let's say you are in a possession of a confidential data that you need to pass on to Mr Charles from Arizona.
You personally do not know Mr Charles, but you do need to deliver the data to him & only to him.
If the data falls into the wrong hands, there's gonna be severe consequences - this is mission critical!

Someone comes along and claim that they are Mr Charles. How do you verify that they are indeed Mr Charles?

Fortunately, you know Mrs Jessica in Arizona whom you trust 100%. And she happens to know our Mr Charles.
She is 100% certain that that person claiming they are Mr Charles is indeed the Mr Charles we're looking for.

This is how via a trusted 3rd party, we were able to verify an identity claim.

Public Key Certificates work in exactly the same fashion. When it comes to certificates, a trusted 3rd party is always involved.
The trusted 3rd party is called a Certificate Authority (CA).

When someone presents a certificate signed by a CA we trust, we can be assured that the public they are presenting on the certificate indeed does belong to the subject in the certificate. In the image above, we can be rest assured that the public key: xyz belongs to the entity: example.com.

## Chain of Trusts

Now imagine, you run into a similar situation once again but this time you're to deliver a confidential message to Mr Smith in Ohio.
However, you do not have anyone trusted in Ohio.

Good thing Mrs Jessica knows Mr Pete in Ohio. She trusts him 100%. Mr Pete know everyone in Ohio and can verify that anyone claiming to be Mr Smith
is indeed Mr Smith.

This is how through a chain of trusted 3rd parties, you were able to verify an identity claim.

## Public Key Infrastructure

Certificate Authorities work in the same manner. In the real world, this chain of trust is maintained via Public Key Infrastructure (PKI).

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
    </marker>
  </defs>
  
  <!-- Root CA -->
  <rect x="350" y="50" width="100" height="60" rx="10" fill="#4CAF50"/>
  <text x="400" y="85" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Root CA</text>
  
  <!-- Intermediate CA 1 -->
  <rect x="200" y="200" width="120" height="60" rx="10" fill="#2196F3"/>
  <text x="260" y="235" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Intermediate CA 1</text>
  
  <!-- Intermediate CA 2 -->
  <rect x="480" y="200" width="120" height="60" rx="10" fill="#2196F3"/>
  <text x="540" y="235" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Intermediate CA 2</text>
  
  <!-- End-user Cert 1 -->
  <rect x="100" y="350" width="100" height="60" rx="10" fill="#FFC107"/>
  <text x="150" y="385" font-family="Arial" font-size="14" fill="white" text-anchor="middle">End-user Cert 1</text>
  
  <!-- End-user Cert 2 -->
  <rect x="250" y="350" width="100" height="60" rx="10" fill="#FFC107"/>
  <text x="300" y="385" font-family="Arial" font-size="14" fill="white" text-anchor="middle">End-user Cert 2</text>
  
  <!-- End-user Cert 3 -->
  <rect x="450" y="350" width="100" height="60" rx="10" fill="#FFC107"/>
  <text x="500" y="385" font-family="Arial" font-size="14" fill="white" text-anchor="middle">End-user Cert 3</text>
  
  <!-- End-user Cert 4 -->
  <rect x="600" y="350" width="100" height="60" rx="10" fill="#FFC107"/>
  <text x="650" y="385" font-family="Arial" font-size="14" fill="white" text-anchor="middle">End-user Cert 4</text>
  
  <!-- Arrows -->
  <line x1="400" y1="110" x2="260" y2="200" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="400" y1="110" x2="540" y2="200" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="260" y1="260" x2="150" y2="350" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="260" y1="260" x2="300" y2="350" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="540" y1="260" x2="500" y2="350" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  <line x1="540" y1="260" x2="650" y2="350" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  
  <!-- Legend -->
  <rect x="650" y="50" width="20" height="20" fill="#4CAF50"/>
  <text x="680" y="65" font-family="Arial" font-size="12" fill="#333">Root CA</text>
  <rect x="650" y="80" width="20" height="20" fill="#2196F3"/>
  <text x="680" y="95" font-family="Arial" font-size="12" fill="#333">Intermediate CA</text>
  <rect x="650" y="110" width="20" height="20" fill="#FFC107"/>
  <text x="680" y="125" font-family="Arial" font-size="12" fill="#333">End-user Certificate</text>
</svg>

### 1. Root Certificate Authorities

Root CAs are organizations that are responsible for the creation, issuance, revocation, and management of Certificates.
They sit at the very top level of the trust chain.
For an entity to become a root CA, it needs to have enough "social" trust for Operating systems and applications to trust it and put it in their trusted root certificate store.

Some of the few popular root CAs are

- Internet Security Research Group (ISRG)
- GlobalSign
- DigiCert

#### Root Certificates

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

#### Root Programs

What's the criteria for a root certificate to be included in an OS's or web brower's trusted store? Why is it that one root certificate that exist in Chrome doesn't exist in Firefox or vice-versa.

The criteria is defined by a root program. One root program may have more strict requirements & guideliness than another and hence can have fewer root certificates in their trusted store. There are several major root programs:

- [Microsoft](https://learn.microsoft.com/en-us/security/trusted-root/program-requirements)
- [Apple](https://www.apple.com/certificateauthority/ca_program.html)
- [Chrome](https://www.chromium.org/Home/chromium-security/root-ca-policy/)
- [Mozilla](https://wiki.mozilla.org/CA)

### 2. Intermediate Certificate Authorities

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
