---
title: Dockerfile isn't the only way to create Container Images
date: '2024-02-24 00:50'
categories:
  - Container
  - docker
  - oci
  - podman
  - buildah
slug: /building-container-images-without-docker
featuredImage: ./containers.png
description: Dockerfiles are a common way to create container images, but they aren’t the only option
---

On a [recent episode](https://changelog.com/shipit/91) of the [ShipIt Podcast](https://changelog.com/shipit), I learned that container images can be built without docker! This may be pretty obvious to someone with a foundational understanding of containers, but to me it was news.

To a lot of people, container images are synonymous to docker images. You have to have a `Dockerfile` and then you need to build it - which can take quite a bit of time to download a bunch of things - .... and finally ... you have an image, right?

> Wrong

I mean that's also true but that's not the only way to get a container image.

Just like a `Dockerfile`, Podman (an alternative to docker) has its own [**Containerfile**](https://www.mankier.com/5/Containerfile). I had heard about Podman before but never gave it a shot. There seems to be another tool - [buildah](https://github.com/containers/buildah/blob/main/docs/tutorials/README.md) which can also build container images without using `Dockerfile`. [Chainguard](https://www.chainguard.dev/chainguard-images) builds a large host of images with Terraform and apko.

This tells us that Docker and Dockerfile is just another way to build a container image. So what exactly is a container image then?

> It turns out that it's simply a bunch of tarballs.

It's actually several other things as well. The image also has the details of

- what command to run after starting the container
- what ports to expose
- what env vars to set

These details and many other details are kept in a variety of manifests as defined in the [spec](https://github.com/opencontainers/image-spec/blob/main/spec.md#understanding-the-specification). Example: Here's an image manifest file

```json
{
  "schemaVersion": 2,
  "mediaType": "application/vnd.oci.image.manifest.v1+json",
  "config": {
    "mediaType": "application/vnd.oci.image.config.v1+json",
    "digest": "sha256:b5b2b2c507a0944348e0303114d8d93aaaa081732b86451d9bce1f432a537bc7",
    "size": 7023
  },
  "layers": [
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee8f0",
      "size": 32654
    },
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:3c3a4604a545cdc127456d94e421cd355bca5b528f4a9c1905b15da2eb4a4c6b",
      "size": 16724
    },
    {
      "mediaType": "application/vnd.oci.image.layer.v1.tar+gzip",
      "digest": "sha256:ec4b8955958665577945c89419d1af06b5f7636b4ac3da7f12184802ad867736",
      "size": 73109
    }
  ],
  "subject": {
    "mediaType": "application/vnd.oci.image.manifest.v1+json",
    "digest": "sha256:5b0bcabd1ed22e9fb1310cf6c2dec7cdef19f0ad69efa1f392e94a4333501270",
    "size": 7682
  },
  "annotations": {
    "com.example.key1": "value1",
    "com.example.key2": "value2"
  }
}
```

But in the summary, the image is in two parts

- the Filesystem
- a collection of metadata

## Building a Container Image

I don't know about you but this terminology subconsciously made me think that an image is a byproduct of a build process. Kind of like how you need to build source code to get a binary. You don't just right binary by hand, right?

But that's not the case. Since images are just a bunch of files, you can, in fact, ~~build~~ create one by hand. An image can be as simple as a folder with a single static binary in it like this [hello-world](https://registry.hub.docker.com/_/hello-world/) image by Docker. Or it can even be an empty folder like the popular [scratch](https://hub.docker.com/_/scratch) image.

---

In hindsight, I feel silly to have not known about this. I am aware of [OCI](https://opencontainers.org/) & I've also watched [Liz Rice build container from scratch](https://www.youtube.com/watch?v=8fi7uSYlOdc) but I just didn't put 1 and 1 together - dang it!

## References

- https://iximiuz.com/en/posts/you-need-containers-to-build-an-image/
- https://github.com/opencontainers/image-spec

## Thanks

- [cycode.com for the featured image](https://cycode.com/blog/introducing-container-secret-scanning/)
