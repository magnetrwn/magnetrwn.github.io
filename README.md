# My Personal Portfolio

### Fully written in Javascript from scratch, without external libraries.

This is still a WIP, so there isn't a detailed README yet.

Tailwind CSS is being used for styling the entire project. An important detail of difference between the `/static` and `/app` folders is that the `/app` folder contains Tailwind CSS, which might require being transformed into CSS later on.

## Directories

There are a few directories in this mainly static project, including:

+ `/app` → All client-side app logic and HTML with Tailwind CSS classes
+ `/static` → All data and images, including JSON static configuration

Since this is meant to be served over a client-only service such as GitHub Pages, there is no back-end of any sort.

## Effects

+ Floating objects background, interactive with `PointerEvent`
+ Terminal-like and typewritten front message main section
+ Large explorer icons (from MingCute open-source collection)
