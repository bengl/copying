# `copying`

**`copying`** is a library for making shallow copies. It requires you to make
particular decisions about *how* you want properties to be copied from one
object to another, to avoid ambiguity about what's actually happening in the
copy.

This module exists to allow developers to make quick, *deliberate* decisions
about how properties ought to be copied between objects, without compromising
any clarity about what's actually going on.

## Usage

This module's `exports` is a function that takes in a mandatory options object
with the following properties, and returns a copier function.

* **`enumerator`**: Must be one of the following string values:
  * `"enumerable"`: The properties to copy will be iterated over using
    `for .. in`.
  * `"ownKeys"`: The properties to copy will be retrieved using
    `Reflect.ownKeys`.
  * `"keys"`: The properties to copy will be retrieved using `Object.keys`.
* **`chain`**: Boolean. If true, the prototype chain will also be iterated over,
  and prototype properties will be copied to destination objects (**not** to the
  destination prototypes). If false, the prototype chain will not be used.
* **`descriptor`**: Boolean. If true, properties will be copied by property
  descriptor. If false, properties will be copied by their resolved values.

> **Note:** `for .. in` and `Object.keys` differ only in whether they include
> items in the prototype chain. Since we're deliberately choosing whether to
> iterate over the prototype chain, `enumerable` and `keys` are equivalent
> values for `enumerator`. Both are kept here, and implemented behind the scenes
> using the two different methods, in case there are performance differences
> between the two.

The returned copier function takes in objects similar to the way `Object.assign`
works. The first argument is the destination object to be copied to, and the
remaining arguments are source objects to be copied from, in the order they
appear.

## Examples

TODO (For now, take a look at the tests.)

## License

MIT License. See LICENSE.txt
