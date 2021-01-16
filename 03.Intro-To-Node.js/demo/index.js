let a = 5;
let b = 3;
console.log(a + b);

let name = 'Pesho';
console.log(name);

// const logger = require('./logger');
import logger from './logger.js';
logger(name);

// const _ = require('lodash');
import _ from 'lodash';
_.each([1, 2, 3, 4, 5], x => console.log(x));

// const fs = require('fs');
import fs from 'fs';

import url from 'url';
const parsedUrl = url.parse('https://judge.softuni.bg/Contests/2601?year=2020&quality=great');
console.log(parsedUrl.hostname);
console.log(parsedUrl);

import querystring from 'querystring';
const queryParameters = querystring.parse(parsedUrl.query);
console.log(queryParameters);
console.log(`${queryParameters.year} year is ${queryParameters.quality}!`);
