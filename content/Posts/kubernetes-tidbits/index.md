---
title: Kubernetes Tidbits
date: '2026-05-30'
categories:
  - kubernetes
slug: /kubernetes-tidbits
description: A list of kubernetes FAQs or lesser known information about it
---

I learn new things about Kubernetes everyday. This is where I'll note them down and keep it updated.

## Labels Vs Annotations

Labels and annotations can appear very similar as they are both key-value metadata attached to a Kubernetes object.
However, they differ in convention in how they are used.

**Labels** are constrained key-value pairs used for _identifying_, _grouping_, and _selecting_ objects. They are commonly used by Kubernetes selectors.
**Annotations** on the other hand are key-value pairs meant to store non-identifying metadata for other tools, controllers, or external systems.

**Examples:**

ReplicaSets use labels on the pods to select which pods they manage.
Services use labels on the pods to determine which pods should receive traffic.

The NGINX Ingress Controller uses annotations for configuration such as timeouts and maximum body size.
Tools like config reloaders may also watch objects with specific annotations.

## Logs of the Previous Container

Container logs are stored on the node running the pod.
`kubectl logs` command hits the kubelet thats responsible for the pod and exposes the logs.

If a container restarts then a new log file is created for that new container by the container runtime.
Kubernetes allows accessing the logs of the current container and the immediately previous terminated container.

```sh
kubectl logs nginx --previous
```

Older logs files are subject eviction

## Liveness vs Readiness Probes

A liveness probe answers whether the container is stuck and should be restarted.
If a container fails the liveness check, the kubelet kills it and the pod's `restartPolicy` determines whether it is restarted.

Readiness on the other hand signals whether the container is ready to accept requests.
On readiness failure, the pod is removed from Service endpoints/EndpointSlices, but the container is **NOT** restarted.

An application's liveness should be as simple as

```pseudo
GET /livez -> 200 OK if the process can respond
```

Whereas readiness may check dependencies required to serve traffic:

```pseudo
GET /readyz -> 200 OK only if required dependencies, such as the database, are reachable
```

## What are Hostpath Volumes for?

Hostpath volumes allow a container to access filesystem of the host node.
It is discouraged to use hostpath for application data.

Hostpath volumes are mainly used for accessing node-scoped resources.
The workload's job is to interact with that specific node (its files, sockets, devices, kernel), so being pinned to the node and seeing its real filesystem is the whole point.

**Examples:**

Monitoring agents and log shippers mounting `/proc`, `/sys`, `/var/log`, etc.

A CNI plugin writes config to `/etc/cni/net.d`.

## Kubectl diff

I'm only learning about this command after more than 3 years of using kubernetes.

```sh
kubectl diff -f fixtures/plugins/golang.yaml
```

```output
diff -u -N /var/folders/6c/1xcmj9z9523bn3gkh2mk530r0000gn/T/LIVE-1476133807/mission-control.flanksource.com.v1.Plugin.mc.golang /var/folders/6c/1xcmj9z9523bn3gkh2mk530r0000gn/T/MERGED-246988991/mission-control.flanksource.com.v1.Plugin.mc.golang
--- /var/folders/6c/1xcmj9z9523bn3gkh2mk530r0000gn/T/LIVE-1476133807/mission-control.flanksource.com.v1.Plugin.mc.golang        2026-05-21 21:28:42
+++ /var/folders/6c/1xcmj9z9523bn3gkh2mk530r0000gn/T/MERGED-246988991/mission-control.flanksource.com.v1.Plugin.mc.golang       2026-05-21 21:28:42
@@ -7,7 +7,7 @@
   creationTimestamp: "2026-05-19T14:52:05Z"
   finalizers:
   - plugin.mission-control.flanksource.com
-  generation: 5
+  generation: 6
   name: golang
   namespace: mc
   resourceVersion: "14831571"
@@ -27,7 +27,7 @@
     - Kubernetes::Job
     - Kubernetes::CronJob
   source: golang-mc-plugin
-  version: v1.0.0
+  version: v1.0.6
 status:
   conditions:
   - lastTransitionTime: "2026-05-19T14:52:47Z"
```

## Secrets vs ConfigMap

Secrets and ConfigMap may seem interchangeable because they are used in similar manner

- API
- Volumes
- EnvVars

But the difference is that kubernetes does take some measures to protect the secrets.
Even though configmap and secrets are volume mounted, secrets are mounted using `tmpfs` so it never hits the nodes disk.

There are also provision to encrypt secrets at rest in etcd.

Also, secrets have various types like Opaque, TLS, basic auth and kubernetes API validates them.

## Replicaset images are practically immutable.

They are updatable but the Replicaset controller doesn't react to it.
Replicaset is only concerned with maintaining the number of desired replicas.

When a deployment creates a new rollout, a new corresponding replicaset is created.

## RuntimeClass

Kubernetes interacts with the container runtime on the node’s operating system via the Container Runtime Interface (CRI).
You can have more than one container runtime installed on your cluster.
If your workload needs stronger security guarantees, then you can choose to run in a Pod that uses a different container runtime.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: kuard
  labels:
    app: kuard
spec:
  runtimeClassName: firecracker
  containers:
    - image: gcr.io/kuar-demo/kuard-amd64:blue
      name: kuard
      ports:
        - containerPort: 8080
          name: http
          protocol: TCP
```

## SecurityContext runAsNonRoot vs runAsUser

What's the purpose of `runAsNonRoot` when you can specify a non-root user id via `runAsUser`.
`runAsNonRoot` is a guardrail.
When set, the container will fail to come up if run with a root user.

## Security Principles

- Defense in depth
- Principle of least privilege
- Reduce attack surface

## Pod Admission Controllers

There's no single monolithic pod validator.
Instead, Kubernetes runs a chain of admission controllers, each handling one narrow concern on the pod spec.
They come in two flavors (some are both):

- Mutating — modify the incoming object. e.g. ServiceAccount injects a default service account; AlwaysPullImages rewrites imagePullPolicy to Always.
- Validating — accept or reject. e.g. ResourceQuota checks the pod's resource requests against the namespace quota.
