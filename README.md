[![Build Status](https://travis-ci.org/moxata/s-dumi.svg?branch=master)](https://travis-ci.org/moxata/s-dumi)
[![Coverage Status](https://coveralls.io/repos/github/moxata/s-dumi/badge.svg?branch=master)](https://coveralls.io/github/moxata/s-dumi?branch=master)

# s-dumi

Number to words (number spelling) in Bulgarian. Version 1.1.0 adds support for EURO. You must pass "евро" as a second parameter.

## How to use?

```javascript
import { sDumi } from 's-dumi';

...

let words = sDumi(123.12, 'евро'); 
```