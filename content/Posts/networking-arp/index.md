---
title: ARP - The DNS for IP addresses
date: '2025-05-17 15:35'
categories:
  - Linux
  - Networking
slug: /address-resolution-protocol
featuredImage: ./arp.png
description: Address Resolution Protocol maps IP addresses to MAC addresses similar to how DNS maps domains to IP addresses.
keywords:
  - Linux
  - Networking
---

In the OSI model, devices in layer 2 - like a Switch - work with MAC address while devices on layer 3 work with IP addresses.
IP packets only know what IP address they are destined to but at the lower level we only have MAC addresses. This tells us that at some point
we need to map IP address to MAC address.

> As always, this post focuses specifically on Linux networking.

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1259.35546875 596.4609375" width="100%" height="100%"><!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
@font-face { font-family: Excalifont; src: url(data:font/woff2;base64,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); }</style></defs><g stroke-linecap="round" transform="translate(10 10.09756018902442) rotate(0 619.677734375 287.15234375)"><path d="M0 0 C308.23 -0.79, 615.75 -1.27, 1239.36 0 M1239.36 0 C1240.89 116.48, 1240.67 232.27, 1239.36 574.3 M1239.36 574.3 C943.24 571.34, 645.86 570.69, 0 574.3 M0 574.3 C2.68 369.97, 1.97 166.94, 0 0" stroke="var(--primary-text-color)" stroke-width="2.5" fill="none" stroke-dasharray="8 10"></path></g><g stroke-linecap="round" transform="translate(843.423828125 10.843374102237817) rotate(0 202.27734375 287.5613082601607)"><path d="M-1.07 0.07 L405.6 0.55 L405.34 575.48 L-0.71 573.36" stroke="none" stroke-width="0" fill="var(--color-bad)"></path><path d="M0 0 C117.75 -2.66, 236.86 -1.54, 404.55 0 M404.55 0 C404.36 130.18, 404 261.35, 404.55 575.12 M404.55 575.12 C267.5 576.95, 127.93 576.01, 0 575.12 M0 575.12 C0.8 452.25, 1.25 328.34, 0 0" stroke="var(--primary-text-color)" stroke-width="1.5" fill="none" stroke-dasharray="8 9"></path></g><g stroke-linecap="round" transform="translate(11.1171875 10) rotate(0 202.748046875 288.23046875)"><path d="M-1.88 1.35 L404.94 0.02 L404.85 574.85 L-1.66 576.81" stroke="none" stroke-width="0" fill="var(--color-good-3)"></path><path d="M0 0 C84.57 1.57, 167.52 2.67, 405.5 0 M405.5 0 C406.4 196.17, 406.29 391.61, 405.5 576.46 M405.5 576.46 C253.27 576.67, 101.59 576.59, 0 576.46 M0 576.46 C-1.38 414.05, -1.46 250.76, 0 0" stroke="var(--primary-text-color)" stroke-width="1.5" fill="none" stroke-dasharray="8 9"></path></g><g stroke-linecap="round" transform="translate(898.1831209863917 413.7358662102483) rotate(0 147.51805088860817 69.714725667284)"><path d="M32 0 C89.86 -1.92, 140.8 2.43, 263.04 0 C282.85 0.72, 295.06 12.27, 295.04 32 C295.67 48.83, 291.79 71.96, 295.04 107.43 C293.64 131.2, 283.07 138.19, 263.04 139.43 C199.62 135.6, 133.81 138.43, 32 139.43 C9.34 135.9, 1.65 125.53, 0 107.43 C-2.7 86.4, 2.05 60.28, 0 32 C-0.71 12.04, 10.32 0.86, 32 0" stroke="none" stroke-width="0" fill="var(--color-bad)"></path><path d="M32 0 C107.79 1.27, 180.05 0.16, 263.04 0 M32 0 C115.79 0.72, 199.39 1.63, 263.04 0 M263.04 0 C282.41 0.23, 293.93 9.01, 295.04 32 M263.04 0 C282.94 0.68, 292.87 12.17, 295.04 32 M295.04 32 C295.2 53.76, 296.93 78.33, 295.04 107.43 M295.04 32 C295.63 47.47, 294.5 64.31, 295.04 107.43 M295.04 107.43 C296.79 130.62, 285.64 138.87, 263.04 139.43 M295.04 107.43 C294.24 128.62, 286.62 137.76, 263.04 139.43 M263.04 139.43 C205.44 141.88, 149.23 141.32, 32 139.43 M263.04 139.43 C194.22 140.65, 126.51 140.97, 32 139.43 M32 139.43 C8.71 140.69, -1.82 130.74, 0 107.43 M32 139.43 C11.97 141.38, 1.88 127.4, 0 107.43 M0 107.43 C0.09 78.34, -0.27 52.02, 0 32 M0 107.43 C-0.73 81.79, -1.03 54.01, 0 32 M0 32 C0.6 12.24, 8.99 1.48, 32 0 M0 32 C-0.43 12.16, 11.76 -1.89, 32 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(941.651985168457 470.9796120784821) rotate(0 104.04918670654297 12.470979799050156)"><text x="104.04918670654297" y="17.579093124741107" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="19.95356767848026px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">MAC: AB:CD:AB:CD:00</text></g><g stroke-linecap="round" transform="translate(66.00390625 413.5736387525323) rotate(0 147.861328125 69.876953125)"><path d="M32 0 C120.04 -4.3, 203.18 -4.41, 263.72 0 C282.71 -0.45, 296.17 10.5, 295.72 32 C293.82 46.59, 298.66 70.83, 295.72 107.75 C296.79 132.68, 287.47 137.69, 263.72 139.75 C187.74 138.89, 104.49 134.89, 32 139.75 C10.78 140.03, -2.28 128.71, 0 107.75 C1.8 85.03, -0.78 68.73, 0 32 C-0.29 10.06, 10.38 1.98, 32 0" stroke="none" stroke-width="0" fill="var(--color-good-3)"></path><path d="M32 0 C82.3 0.42, 135.12 -0.32, 263.72 0 M32 0 C108.83 0.44, 185.59 0.74, 263.72 0 M263.72 0 C285.72 -0.8, 297.01 12.19, 295.72 32 M263.72 0 C285.3 -0.24, 295.84 10.45, 295.72 32 M295.72 32 C295.41 52.66, 296.71 75.95, 295.72 107.75 M295.72 32 C295.95 59.59, 295.17 89, 295.72 107.75 M295.72 107.75 C295.09 128.55, 283.38 137.94, 263.72 139.75 M295.72 107.75 C294.99 127.74, 284.34 140.94, 263.72 139.75 M263.72 139.75 C192.2 140.92, 116.71 138.48, 32 139.75 M263.72 139.75 C174.58 141.14, 86.27 139.88, 32 139.75 M32 139.75 C9.9 138.9, 0.75 127.81, 0 107.75 M32 139.75 C11.47 140.08, -0.2 131.05, 0 107.75 M0 107.75 C-1.31 82.27, -1.49 57.54, 0 32 M0 107.75 C0.32 77.92, 1.38 48.73, 0 32 M0 32 C-1.58 11.88, 9.08 1.95, 32 0 M0 32 C-0.42 9.51, 11.04 0.93, 32 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(133.25528717041016 470.9505918775323) rotate(0 80.60994720458984 12.5)"><text x="80.60994720458984" y="17.619999999999997" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">MAC: 11:11:11:11:11</text></g><g stroke-linecap="round" transform="translate(494.0302734375 429.3061566885079) rotate(0 135.98828125 53.87890625)"><path d="M26.94 0 C96.42 3.35, 172.55 1.43, 245.04 0 C262.05 0.2, 274.89 9.49, 271.98 26.94 C269.37 42.5, 274.18 63.41, 271.98 80.82 C272.73 101.82, 261.57 107.7, 245.04 107.76 C197.2 106.67, 156.52 106.44, 26.94 107.76 C7.88 111.14, 0.27 102.35, 0 80.82 C2.38 58.91, -0.09 39.99, 0 26.94 C2.07 10.59, 8.14 0.2, 26.94 0" stroke="none" stroke-width="0" fill="var(--color-good)"></path><path d="M26.94 0 C111.63 1.25, 193.93 3.14, 245.04 0 M26.94 0 C93.91 -0.29, 162.33 0.63, 245.04 0 M245.04 0 C262.69 -0.42, 272.64 7.58, 271.98 26.94 M245.04 0 C264.87 -0.09, 272.22 7.2, 271.98 26.94 M271.98 26.94 C272.56 44.12, 270.76 62.42, 271.98 80.82 M271.98 26.94 C271.4 46.67, 271.04 64.18, 271.98 80.82 M271.98 80.82 C270.22 98.53, 263.7 107.85, 245.04 107.76 M271.98 80.82 C270.52 100.8, 263.62 105.47, 245.04 107.76 M245.04 107.76 C161.68 110.06, 76.45 107.94, 26.94 107.76 M245.04 107.76 C192 108.98, 139.41 108.76, 26.94 107.76 M26.94 107.76 C9.02 108.83, -0.69 100.31, 0 80.82 M26.94 107.76 C9.07 108.1, 1.74 97.17, 0 80.82 M0 80.82 C0.85 68.17, 1.21 50.77, 0 26.94 M0 80.82 C0.64 66.46, 0.66 52.88, 0 26.94 M0 26.94 C1.35 10.71, 8.34 -0.06, 26.94 0 M0 26.94 C-0.83 10.42, 8.55 0.58, 26.94 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(554.688606262207 470.6850629385079) rotate(0 75.32994842529297 12.5)"><text x="75.32994842529297" y="17.619999999999997" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Network Switch</text></g><g stroke-linecap="round" transform="translate(90.50390625 105.15615393902442) rotate(0 123.361328125 80)"><path d="M32 0 C102.15 -4.79, 169.57 -2.66, 214.72 0 C234.28 2.48, 249.44 9.24, 246.72 32 C250.5 56.02, 249.66 78.39, 246.72 128 C249.17 147.24, 234.26 162.29, 214.72 160 C150.48 156.7, 89.99 158.17, 32 160 C10.76 158.89, 2.98 146.79, 0 128 C-3.86 98.92, 0.31 64.57, 0 32 C1.45 11.28, 7.96 -1.47, 32 0" stroke="none" stroke-width="0" fill="var(--color-good-3)"></path><path d="M32 0 C99.48 -2.28, 163.3 -0.72, 214.72 0 M32 0 C102.87 0.08, 175.02 -1.39, 214.72 0 M214.72 0 C237.02 -1.2, 248.65 11.23, 246.72 32 M214.72 0 C237.83 -0.74, 246.81 9.68, 246.72 32 M246.72 32 C244.87 59.69, 245.69 88.27, 246.72 128 M246.72 32 C245.88 63.36, 247.2 96.03, 246.72 128 M246.72 128 C247.77 149.52, 235.97 158.92, 214.72 160 M246.72 128 C248.3 149.2, 236.25 159.44, 214.72 160 M214.72 160 C176.07 160.47, 140.59 158.84, 32 160 M214.72 160 C146.97 160.65, 79.31 160.6, 32 160 M32 160 C11.7 161.52, -1.6 150.24, 0 128 M32 160 C9.86 161.22, 1.49 149.94, 0 128 M0 128 C2.19 108.26, 2.58 88.11, 0 32 M0 128 C-1.05 96.02, -1.58 64.49, 0 32 M0 32 C-0.24 11.11, 10.39 0.13, 32 0 M0 32 C1.47 8.75, 12.03 1.49, 32 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(140.8552703857422 172.65615393902442) rotate(0 73.00996398925781 12.5)"><text x="73.00996398925781" y="17.619999999999997" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">IP: 10.0.0.1/24</text></g><g transform="translate(158.8671875 33.64834143902442) rotate(0 42.02996826171875 25)"><text x="0" y="17.619999999999997" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Device A</text><text x="0" y="42.62" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic"></text></g><g transform="translate(1004.2148281371074 32.60845938440383) rotate(0 42.7804159157281 12.470979799050161)"><text x="0" y="17.579093124741107" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="19.95356767848026px" fill="var(--primary-text-color)" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Device B</text></g><g transform="translate(251.24081420898438 107.17568518902442) rotate(0 36.059967041015625 12.5)"><text x="36.059967041015625" y="17.619999999999997" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Layer 3</text></g><g transform="translate(250.81690216064453 415.4725601890244) rotate(0 36.97997283935547 12.5)"><text x="36.97997283935547" y="17.619999999999997" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Layer 2</text></g><g transform="translate(1075.286937444885 422.377241460155) rotate(0 36.89411953992203 12.470979799050156)"><text x="36.89411953992205" y="17.579093124741107" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="19.95356767848026px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Layer 2</text></g><g stroke-linecap="round" transform="translate(922.6262413925301 120.08848549355349) rotate(0 123.07493048246988 79.81427071392103)"><path d="M32 0 C72.97 -0.82, 117.57 -0.78, 214.15 0 C233.76 1.87, 248.98 13.2, 246.15 32 C244.51 57.9, 243.46 79.87, 246.15 127.63 C249.72 147.55, 235.71 161.57, 214.15 159.63 C153.55 160.64, 92.67 161.74, 32 159.63 C8.29 162.39, 2.47 151.11, 0 127.63 C0.13 106.98, 2.37 86.31, 0 32 C-0.11 9.02, 11.36 -1.09, 32 0" stroke="none" stroke-width="0" fill="var(--color-bad)"></path><path d="M32 0 C89.31 1.07, 145.05 1.36, 214.15 0 M32 0 C87.23 1.8, 145.26 0.01, 214.15 0 M214.15 0 C236.23 0.5, 247.04 8.93, 246.15 32 M214.15 0 C234.19 0.75, 248.3 9.87, 246.15 32 M246.15 32 C245.47 53.7, 246.36 76.81, 246.15 127.63 M246.15 32 C245.75 65.78, 245.63 100.46, 246.15 127.63 M246.15 127.63 C247.64 149.64, 235.92 159.82, 214.15 159.63 M246.15 127.63 C248.42 147.72, 233.57 160.05, 214.15 159.63 M214.15 159.63 C155.31 156.37, 93.74 158.83, 32 159.63 M214.15 159.63 C145.05 158.76, 78.13 159.86, 32 159.63 M32 159.63 C11.49 158.55, 0.27 149.79, 0 127.63 M32 159.63 C11.72 158.49, 0.52 147.18, 0 127.63 M0 127.63 C2.05 98.01, 0.09 65.56, 0 32 M0 127.63 C0.88 93.72, -0.07 61.08, 0 32 M0 32 C1.8 12.03, 11.24 -1.34, 32 0 M0 32 C1.3 12.51, 9.53 -1.98, 32 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(970.1127014160156 187.43177640842435) rotate(0 75.58847045898438 12.470979799050156)"><text x="75.58847045898438" y="17.579093124741107" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="19.95356767848026px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">IP: 10.0.0.2/24</text></g><g transform="translate(1076.9024027754829 122.36443930688017) rotate(0 35.97624964183365 12.470979799050163)"><text x="35.97624964183364" y="17.579093124741107" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="19.95356767848026px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Layer 3</text></g><g mask="url(#mask-Pda5XBN6nUZM_KkkOPi5x)" stroke-linecap="round"><g transform="translate(206.45210287851808 268.3333191551128) rotate(0 0 70.99013411515007)"><path d="M0 0 C-1.29 44.2, -1.16 86.72, 0 141.98 M0 0 C0.04 29.88, -0.16 59.82, 0 141.98" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(206.45210287851808 268.3333191551128) rotate(0 0 70.99013411515007)"><path d="M8.36 23.56 C4.69 18.14, 2.32 11.05, 0 0 M8.36 23.56 C7.29 18.57, 5.32 13.59, 0 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(206.45210287851808 268.3333191551128) rotate(0 0 70.99013411515007)"><path d="M-8.74 23.42 C-7.29 18.07, -4.53 11.02, 0 0 M-8.74 23.42 C-6.21 18.32, -4.56 13.37, 0 0" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(206.45210287851808 268.3333191551128) rotate(0 0 70.99013411515007)"><path d="M-8.57 118.5 C-7.21 127.2, -4.5 134.21, 0 141.98 M-8.57 118.5 C-6.26 123.3, -4.65 128.24, 0 141.98" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g><g transform="translate(206.45210287851808 268.3333191551128) rotate(0 0 70.99013411515007)"><path d="M8.53 118.48 C4.77 127.16, 2.35 134.17, 0 141.98 M8.53 118.48 C7.23 123.42, 5.23 128.37, 0 141.98" stroke="var(--primary-text-color)" stroke-width="2" fill="none"></path></g></g><mask id="mask-Pda5XBN6nUZM_KkkOPi5x"><rect x="0" y="0" fill="var(--primary-text-color)" width="306.4521028785181" height="510.3135873854129"></rect><rect x="115.66217062754151" y="301.8234532702629" fill="" width="181.57986450195312" height="75" opacity="1"></rect></mask><g transform="translate(115.66217062754151 301.8234532702629) rotate(0 90.33281932066586 37.499999999999986)"><text x="90.78993225097656" y="17.619999999999997" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Hey can you please</text><text x="90.78993225097656" y="42.62" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">send this packet</text><text x="90.78993225097656" y="67.62" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="20px" fill="var(--primary-text-color)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">to 10.0.0.2/24?</text></g><g stroke-linecap="round" transform="translate(512.4342447916667 92.39366067595412) rotate(0 117.58430989583337 94.32623361070183)"><path d="M32 0 C89.04 3.29, 144.5 3.22, 203.17 0 M32 0 C74.94 3.33, 119.75 2.95, 203.17 0 M203.17 0 C223.37 -3.08, 234.38 6.97, 235.17 32 M203.17 0 C220.71 3.74, 237.47 15.06, 235.17 32 M235.17 32 C239.5 73.92, 234.72 112.81, 235.17 156.65 M235.17 32 C236.51 65.45, 235.16 98.75, 235.17 156.65 M235.17 156.65 C236.14 181.01, 227.08 192.29, 203.17 188.65 M235.17 156.65 C236.63 174.49, 228.12 192.64, 203.17 188.65 M203.17 188.65 C156.16 188.37, 101.57 187.91, 32 188.65 M203.17 188.65 C152.39 192.17, 99.48 190.66, 32 188.65 M32 188.65 C12.75 190.36, -3.83 177.19, 0 156.65 M32 188.65 C6.95 190.57, -2.14 181.78, 0 156.65 M0 156.65 C1.58 123.36, 2.33 95.33, 0 32 M0 156.65 C-3.2 122.23, -3.6 86.99, 0 32 M0 32 C-1.43 9.04, 12.53 1.77, 32 0 M0 32 C-1.38 7.57, 6.74 -4.46, 32 0" stroke="var(--primary-text-color)" stroke-width="1" fill="none"></path></g><g transform="translate(538.8622817993165 162.1467720043874) rotate(0 91.15627288818354 24.573122282268557)"><text x="91.1562728881836" y="17.319136584542882" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="19.658497825814848px" fill="var(--color-bad)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">I don't understand</text><text x="91.1562728881836" y="41.892258866811446" font-family="Excalifont, Xiaolai, Segoe UI Emoji" font-size="19.658497825814848px" fill="var(--color-bad)" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">what 10.0.0.2 is !!</text></g><g stroke-linecap="round"><g transform="translate(364.42690476312134 448.20134660682004) rotate(0 70.10216534808603 -131.43340108122226)"><path d="M0 0 C8.43 -31.24, 27.19 -143.66, 50.56 -187.47 C73.93 -231.28, 125.26 -250.3, 140.2 -262.87 M0 0 C8.43 -31.24, 27.19 -143.66, 50.56 -187.47 C73.93 -231.28, 125.26 -250.3, 140.2 -262.87" stroke="var(--primary-text-color)" stroke-width="1" fill="none"></path></g><g transform="translate(364.42690476312134 448.20134660682004) rotate(0 70.10216534808603 -131.43340108122226)"><path d="M124.87 -243.12 C130.24 -250.03, 135.6 -256.93, 140.2 -262.87 M124.87 -243.12 C129.44 -249.01, 134.02 -254.9, 140.2 -262.87" stroke="var(--primary-text-color)" stroke-width="1" fill="none"></path></g><g transform="translate(364.42690476312134 448.20134660682004) rotate(0 70.10216534808603 -131.43340108122226)"><path d="M115.77 -257.6 C124.31 -259.44, 132.86 -261.28, 140.2 -262.87 M115.77 -257.6 C123.06 -259.17, 130.34 -260.74, 140.2 -262.87" stroke="var(--primary-text-color)" stroke-width="1" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(751.9513737141349 480.42837102464387) rotate(0 72.37758358526958 0.041967477071892745)"><path d="M0 0 C24.13 0.01, 120.63 0.07, 144.76 0.08 M0 0 C24.13 0.01, 120.63 0.07, 144.76 0.08" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(751.9513737141349 480.42837102464387) rotate(0 72.37758358526958 0.041967477071892745)"><path d="M23.5 -8.54 C17.37 -6.31, 11.23 -4.08, 0 0 M23.5 -8.54 C14.48 -5.26, 5.47 -1.99, 0 0" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(751.9513737141349 480.42837102464387) rotate(0 72.37758358526958 0.041967477071892745)"><path d="M23.49 8.56 C17.36 6.33, 11.23 4.09, 0 0 M23.49 8.56 C14.48 5.28, 5.47 1.99, 0 0" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(751.9513737141349 480.42837102464387) rotate(0 72.37758358526958 0.041967477071892745)"><path d="M121.26 8.62 C127.39 6.39, 133.52 4.17, 144.76 0.08 M121.26 8.62 C130.27 5.35, 139.29 2.07, 144.76 0.08" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(751.9513737141349 480.42837102464387) rotate(0 72.37758358526958 0.041967477071892745)"><path d="M121.27 -8.48 C127.4 -6.25, 133.53 -4.01, 144.76 0.08 M121.27 -8.48 C130.28 -5.19, 139.29 -1.91, 144.76 0.08" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(475.80609376888697 483.55255800013566) rotate(0 -56.588324317705826 0.49349871842844095)"><path d="M0 0 C-18.86 0.16, -94.31 0.82, -113.18 0.99 M0 0 C-18.86 0.16, -94.31 0.82, -113.18 0.99" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(475.80609376888697 483.55255800013566) rotate(0 -56.588324317705826 0.49349871842844095)"><path d="M-23.42 8.76 C-15.99 5.98, -8.56 3.2, 0 0 M-23.42 8.76 C-16.79 6.28, -10.17 3.8, 0 0" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(475.80609376888697 483.55255800013566) rotate(0 -56.588324317705826 0.49349871842844095)"><path d="M-23.57 -8.35 C-16.09 -5.7, -8.62 -3.05, 0 0 M-23.57 -8.35 C-16.9 -5.98, -10.23 -3.62, 0 0" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(475.80609376888697 483.55255800013566) rotate(0 -56.588324317705826 0.49349871842844095)"><path d="M-89.76 -7.77 C-97.19 -4.99, -104.62 -2.21, -113.18 0.99 M-89.76 -7.77 C-96.38 -5.29, -103.01 -2.81, -113.18 0.99" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g><g transform="translate(475.80609376888697 483.55255800013566) rotate(0 -56.588324317705826 0.49349871842844095)"><path d="M-89.61 9.33 C-97.09 6.69, -104.56 4.04, -113.18 0.99 M-89.61 9.33 C-96.28 6.97, -102.94 4.61, -113.18 0.99" stroke="var(--primary-text-color)" stroke-width="4" fill="none"></path></g></g><mask></mask></svg>

That's where ARP comes in. ARP _(Address Resolution Protocol)_ maps IP addresses to MAC addresses. If you are familiar with DNS, ARP is similar to that [_[1]_](#ref-1).

```
DNS: Map Domain names -> IP addresses

ARP: Map IP addresses -> MAC addresses
```

ARP lives in-between L2 & L3 - often called L2.5.

It's clear that we need a record of mapping of IP addresses to MAC addresses. But where does that record live? And who populates it? If you consider DNS, the mapping needs to be supplied by a human and is stored in whatever nameserver is chosen.

ARP, on the other hand, doesn't have a pre-populated record to refer to. This is because unlike DNS, IP -> MAC address is much more dynamic.
Rather, the mapping is queried when required.

In the example above, we need the mac address for `10.0.0.2`. The networking stack sends an `ARP` request to all the devices connected to the network segment [_[2]_](#ref-2) requesting whoever has `10.0.0.2` to send it back the MAC address. The way to send this message to all the devices is by using the broadcast address [_[3]_](#ref-3).
The ARP request is received by all the devices in the network segment and the device that actually is assigned the IP address will send back an ARP response.
This response is addressed directly to the MAC address of the requester rather than broadcasting it to everyone.

This mechanism prevents the network administrators from maintaining any sort of record as the protocol is self sufficient.

### Caching

It would be very inefficient if we had to query the MAC addresses for every single IP packet. That's why the ARP responses are cached.
The cache usually has a timeout period in the span of a few seconds.

There's also another more efficient way to invalidate the cache - it's by sending a **gratuitous ARP** message.
Basically, when a device gets a new IP address it'll simply send a gratuitous ARP message broadcasting its own IP address.
Other devices will then invalidate any stale records.

Users can also manually flush the entire cache as we'll see in a minute.

## ARP inside the Linux kernel

ARP is maintained by the Linux kernel. More specifically by the IPV4 subsytem - https://github.com/torvalds/linux/blob/master/net/ipv4/arp.c.

IPV6 doesn't use ARP. It still does need a protocol to map IP addresses to MAC addresses, but that protocol is not ARP.
Instead, it uses **Neighbor Discovery Protocol** (NDP).

ARP is completely transparent. The IP subsytem in Linux automatically issues ARP requests when it doesn’t have a MAC address for a given.

```
  ┌────────────────────────────┐                     ┌────────────────────────────┐
  │      Host A (sender)       │                     │      Host B (target)       │
  │────────────────────────────│                     │────────────────────────────│
  │  IP: 192.168.1.10          │                     │  IP: 192.168.1.20          │
  │  MAC: AA:AA:AA:AA:AA:AA    │                     │  MAC: BB:BB:BB:BB:BB:BB    │
  └────────────┬───────────────┘                     └────────────┬───────────────┘
               │                                                  │
               │ 1️⃣  **ARP REQUEST** (broadcast frame)            │
               │     ───────────────────────────────────────────▶ │
               │     Dest MAC: FF:FF:FF:FF:FF:FF                  │
               │     Src  MAC: AA:AA:AA:AA:AA:AA                  │
               │     Payload: “Who has 192.168.1.20?              │
               │               Tell 192.168.1.10.”                │
               │                                                  │
               │                                                  │
               │                2️⃣  **ARP REPLY** (unicast frame) │
               │     ◀─────────────────────────────────────────── │
               │     Dest MAC: AA:AA:AA:AA:AA:AA                  │
               │     Src  MAC: BB:BB:BB:BB:BB:BB                  │
               │     Payload: “192.168.1.20 is at                 │
               │               BB:BB:BB:BB:BB:BB.”                │
               │                                                  │
  ┌────────────▼───────────────┐                     ┌────────────▼───────────────┐
  │ 3️⃣  Host A updates its     │                     │ (Host B may also cache     │
  │     ARP cache:             │                     │  Host A’s mapping.)        │
  │     192.168.1.20 ↔ BB:BB…  │                     └────────────────────────────┘
  └────────────┬───────────────┘
               │
               │ 4️⃣  **Normal traffic** (e.g., IP packets)
               │     sent directly to MAC BB:BB:BB:BB:BB:BB
               ▼
        (Frame delivery continues as usual)



                        Fig: Created by OpenAI o3
```


## Demo

Let's get our hands dirty. We'll use the mighty `ip` command line tool to investigate ARP records and get a live view of ARP messages.
You can follow along this demo if you're on a Linux system _(not unix - doesn't work on MacOS)_

```sh
ip neigh
````

```
10.99.99.1 dev vmbr0 lladdr 74:fe:ce:6e:01:59 STALE
10.99.99.115 dev vmbr0 lladdr 9c:9d:7e:54:16:78 STALE
10.99.99.51 dev vmbr0 lladdr 30:f9:ed:c1:26:07 REACHABLE
10.99.99.8 dev vmbr0 lladdr 26:f4:91:9d:2c:86 REACHABLE
10.99.99.5 dev vmbr0 lladdr 12:31:43:ab:7d:aa STALE
10.99.99.131 dev vmbr0 lladdr 92:95:3e:3f:cd:81 DELAY
10.99.99.9 dev vmbr0 lladdr fe:7a:08:2c:fa:4e STALE
fe80::c20:96e8:c4b7:d575 dev vmbr0 lladdr 92:95:3e:3f:cd:81 STALE
fe80::fc7a:8ff:fe2c:fa4e dev vmbr0 lladdr fe:7a:08:2c:fa:4e STALE
fe80::103c:2fff:4455:e2e9 dev vmbr0 lladdr 2a:13:6d:9e:b9:ff STALE
fe80::32f9:edff:fec1:2607 dev vmbr0 lladdr 30:f9:ed:c1:26:07 STALE
fe80::28b1:57ff:fe29:ef4a dev vmbr0 lladdr 2a:b1:57:29:ef:4a STALE
fe80::ac09:e9ff:fee2:75d6 dev vmbr0 lladdr ae:09:e9:e2:75:d6 STALE
fe80::901d:ccff:fe64:ad04 dev vmbr0 lladdr 92:1d:cc:64:ad:04 STALE
fe80::c295:cfff:fe8b:a269 dev vmbr0 lladdr c0:95:cf:8b:a2:69 STALE
fe80::88a1:5fff:fe2b:fcd1 dev vmbr0 lladdr 8a:a1:5f:2b:fc:d1 STALE
fe80::1031:43ff:feab:7daa dev vmbr0 lladdr 12:31:43:ab:7d:aa STALE
fe80::21d8:9d95:d19d:af8f dev vmbr0 lladdr 58:24:29:7a:5f:a6 STALE
fe80::1c5e:aa1b:fa11:bebd dev vmbr0 lladdr 02:fa:76:28:bb:25 STALE
fe80::24f4:91ff:fe9d:2c86 dev vmbr0 lladdr 26:f4:91:9d:2c:86 STALE
```

> we mentioned ARP doesn't work with IPv6 and yet we still see ipv6 above. That's because `ip neigh` returns ARP & NDISC cache entries.

Let's try cleaning up the cache

```sh
ip neigh flush all
```

### Monitor live ARP message

We'll use `tcpdump`

```sh
sudo tcpdump -n -i enp8s0 arp

# replace enp8s0 with your network interface.
# use `ip link` to see the list of network interfaces in your system.
```

```
listening on enp8s0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
15:15:43.403688 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:15:46.435738 ARP, Request who-has 10.99.99.222 (ff:ff:ff:ff:ff:ff) tell 10.99.99.222, length 28
15:15:49.467785 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:15:52.220755 ARP, Request who-has 10.99.99.5 tell 10.99.99.115, length 46
15:15:52.220947 ARP, Reply 10.99.99.5 is-at 12:31:43:ab:7d:aa, length 28
15:15:52.229263 ARP, Request who-has 10.99.99.115 tell 10.99.99.5, length 28
15:15:52.229574 ARP, Reply 10.99.99.115 is-at 9c:9d:7e:54:16:78, length 46
15:15:52.499759 ARP, Request who-has 10.99.99.222 (ff:ff:ff:ff:ff:ff) tell 10.99.99.222, length 28
15:15:55.420196 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:55.531744 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:15:56.402074 ARP, Request who-has 192.168.1.254 tell 192.168.1.1, length 46
15:15:56.451366 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:56.771925 ARP, Request who-has 10.99.99.51 tell 10.99.99.9, length 28
15:15:56.772240 ARP, Reply 10.99.99.51 is-at 30:f9:ed:c1:26:07, length 46
15:15:57.401975 ARP, Request who-has 192.168.1.254 tell 192.168.1.1, length 46
15:15:57.474439 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:58.402074 ARP, Request who-has 192.168.1.254 tell 192.168.1.1, length 46
15:15:58.498718 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:15:58.571763 ARP, Request who-has 10.99.99.222 (ff:ff:ff:ff:ff:ff) tell 10.99.99.222, length 28
15:15:59.522361 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:16:00.547347 ARP, Request who-has 10.99.99.55 tell 10.99.99.4, length 28
15:16:01.603792 ARP, Reply 10.99.99.222 is-at 2a:b1:57:29:ef:4a, length 28
15:16:02.171191 ARP, Request who-has 10.99.99.1 tell 10.99.99.115, length 46
15:16:02.181128 ARP, Request who-has 10.99.99.2 tell 10.99.99.115, length 46
15:16:02.191115 ARP, Request who-has 10.99.99.3 tell 10.99.99.115, length 46
15:16:02.201213 ARP, Request who-has 10.99.99.4 tell 10.99.99.115, length 46
15:16:02.201264 ARP, Reply 10.99.99.4 is-at 08:97:98:75:cc:fd, length 28
15:16:02.211140 ARP, Request who-has 10.99.99.5 tell 10.99.99.115, length 46
15:16:02.211402 ARP, Reply 10.99.99.5 is-at 12:31:43:ab:7d:aa, length 28
15:16:02.221140 ARP, Request who-has 10.99.99.6 tell 10.99.99.115, length 46
15:16:02.222453 ARP, Reply 10.99.99.6 is-at 2a:b1:57:29:ef:4a, length 28
15:16:02.231200 ARP, Request who-has 10.99.99.7 tell 10.99.99.115, length 46
15:16:02.241218 ARP, Request who-has 10.99.99.8 tell 10.99.99.115, length 46
15:16:02.241411 ARP, Reply 10.99.99.8 is-at 26:f4:91:9d:2c:86, length 28
15:16:02.251118 ARP, Request who-has 10.99.99.9 tell 10.99.99.115, length 46
15:16:02.251278 ARP, Reply 10.99.99.9 is-at fe:7a:08:2c:fa:4e, length 28
15:16:02.261225 ARP, Request who-has 10.99.99.10 tell 10.99.99.115, length 46
15:16:02.271116 ARP, Request who-has 10.99.99.11 tell 10.99.99.115, length 46
15:16:02.281112 ARP, Request who-has 10.99.99.12 tell 10.99.99.115, length 46
```

## Things we didn't cover

- Security aspects (ARP spoofing / Dynamic ARP)

---

## References

<div id="ref-1">
<i>[1]</i>. ARP and DNS are similar only at the surface level in the sense that both protocols map an address from a higher level <i>(in the OSI model)</i> to a lower level. They have a lot of differences - example: DNS is global and hierarchical while ARP is local and flat. So take this analogy with a grain of salt.
</div>

</br>

<div id="ref-2">
<i>[2]</i>. A network segment is a section of a computer network where all devices are directly connected and can communicate with each other at the data link layer (Layer 2) without needing to go through a router.
</div>
</br>

<div id="ref-3">
<i>[3]</i>. A broadcast address in layer 2 is - <code>FF:FF:FF:FF:FF:FF</code>. It's an address that doesn't belong to a single device but any message sent to that address is delivered to all the devices.
</div>
</br>
