# Static CLI

This is a tool for creating Markdown files with YAML frontmatter that I use to generate posts for my blog. I use it for the specific purpose of writing JSON data that I have scraped from my Audible account to markdown files that I include in the [library on my website](https://www.ericdorsey.com/library/).


This means that there are some hard coded things included that I don't plan on fixing until I find more use cases.

## Usage:

```
➜  static --help

  Usage: static [options]

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -n, --name [nameAttribute]  Attribute to use to name the file
    -l, --location [./output]   Where to save post(s)
    -a, --assets [../images]    Where to save image(s)
    --debug                     Debug output

```

For example:
```
➜  bd | static -l ./src/library -a ./assets/images/library
```



