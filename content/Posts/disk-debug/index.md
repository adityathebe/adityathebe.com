---
title: Debugging disk usage On Linux
date: '2024-10-19'
categories:
  - Linux
  - iotop
  - iostat
  - debugging
  - performance
slug: /debug-disk-usage
description: Here's how I am monitoring disk usage on Linux
---

My pretty powerful desktop with a intel i9-14900k feels a bit laggy sometimes.
A very identical Linux installation on my 9th gen i5 laptop never had this occasional lag.

The weird thing is that the CPU usage is pretty low when the system is lagging. Upon further investigation I found out
that the CPU load on the other hand was pretty high!

> Yes, your CPU could be chilling at ~1% usage and still be peaking on CPU load.

```sh
> cat /proc/loadavg

# 0.71 0.58 0.56 2/1605 22984
```

That was quite baffling to me at first but it does make sense now. CPU load takes I/O into account.
If your disk cannot keep up with your CPU, processes have to basically pause & wait for the disk to catch up.
This increases the CPU load metric.

On my 24 core machine, the CPU load goes as high as 35-40 when I fireup my development environment after initial boot.
That includes launching

- a Tmux session with 3 different go builds occuring simulataneously and about 6 docker containers
- and also launching the web browser with 6-7 tabs.

## CPU Load

CPU load represents the average number of processes waiting for or using CPU time.

> "Each process using or waiting for CPU (the ready queue or run queue) increments the load number by 1.
> Each process that terminates decrements it by 1.
> Most UNIX systems count only processes in the running (on CPU) or runnable (waiting for CPU) states"
>
> -- Wikipedia

A CPU load of **1** on a single-core machine indicates full CPU utilization.
On a quad-core CPU, a load of **2** suggests 50% utilization across all cores.
When the load exceeds the number of CPU cores, processes begin to queue, and the system beings to lag.

In my case, the fact that the CPU usage is pretty low suggests that the high load is caused by IO.

## Tools to debug slow disk

2 tools seem to be the universal choice to debug disk operations.

### iotop

`iotop` lists out all the processes and the amount of data those processes have read from or written to the disk.

```sh
sudo iotop -aoP

# Flags
# -a accumulative mode where iotop shows the amount of I/O processes have done since iotop started.
# -o only shows processes actually doing I/O
# -P shows processes instead of threads
```

This is helpful to figure out what processes are hogging the disk.

```
> sudo iotop -aoP
Total DISK READ :       0.00 B/s | Total DISK WRITE :     178.60 K/s
Actual DISK READ:       0.00 B/s | Actual DISK WRITE:       0.00 B/s
    PID  PRIO  USER     DISK READ DISK WRITE>  SWAPIN      IO    COMMAND
   5380 be/4 aditya      556.00 K     33.71 M  ?unavailable?  node /home/aditya/projects/adityathebe.com/.cache/tmp-5353-NH1acrOpTEuF
   3238 be/4 aditya       76.00 K     31.57 M  ?unavailable?  brave
   3277 be/4 aditya      128.00 K     17.25 M  ?unavailable?  brave --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US
    464 be/3 root          0.00 B     15.47 M  ?unavailable?  [jbd2/nvme0n1p2-8]
  28731 be/4 aditya        0.00 B      3.20 M  ?unavailable?  nvim --embed .
    523 be/4 root          0.00 B    128.00 K  ?unavailable?  systemd-journald
   3293 be/4 aditya        0.00 B     88.00 K  ?unavailable?  brave --type=utility --utility-sub-type=storage.mojom.StorageService --lang=en-US
    222 be/7 root       1024.00 K      0.00 B  ?unavailable?  [khugepaged]
  30530 be/4 root         32.00 K      0.00 B  ?unavailable?  python /usr/bin/iotop -aoP
```

I have sorted the list based on Disk Write. As you can see, `node` is the currently running process with the highest disk write.

Unfortunately the biggest flaw with this tool is that if a process dies iotop removes it from the list.
It would have been nice to be able to leave iotop running in the background for few hours and then inspect the output later. Due to this reason, this tool wasn't really that helpful to me and I couldn't find any other tool that does that.

### iostat

`iostat` is another tool that gives you the current disk read/s & write/s info along with couple of other similar metrics.

```sh
sudo iostat -xm 1

# Flags
# -x extended statistics
# -m Display statistics in megabytes per second

# argument
# interval: the amount of time in seconds between each report.
# if 1 is supplied, the output refreshes every 1 second.
```

This tool is really helpful to get the instaneous disk bandwidth.

```sh
sudo iostat -m 1
Linux 6.11.4-arch1-1 (desktop) 	10/19/2024 	_x86_64_	(32 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           1.32    0.00    0.56    0.18    0.00   97.94

Device             tps    MB_read/s    MB_wrtn/s    MB_dscd/s    MB_read    MB_wrtn    MB_dscd
nvme0n1          43.24         0.70         0.40         0.00       2799       1594          0
nvme1n1           0.10         0.00         0.00         0.00         10          0          0


avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.25    0.00    0.22    0.00    0.00   99.53

Device             tps    MB_read/s    MB_wrtn/s    MB_dscd/s    MB_read    MB_wrtn    MB_dscd
nvme0n1          81.00         0.00         0.45         0.00          0          0          0
nvme1n1           0.00         0.00         0.00         0.00          0          0          0


avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.38    0.00    0.25    0.03    0.00   99.34

Device             tps    MB_read/s    MB_wrtn/s    MB_dscd/s    MB_read    MB_wrtn    MB_dscd
nvme0n1          10.00         0.00         0.12         0.00          0          0          0
nvme1n1           0.00         0.00         0.00         0.00          0          0          0
```

---

Ultimately, neither of these two tools really helped by get to the bottom of the issue however XD.
