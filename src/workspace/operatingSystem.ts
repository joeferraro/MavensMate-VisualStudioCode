'use strict';

import os = require('os');

export function platform(){
    return os.platform();
}

export function isWindows(){
    return os.platform().startsWith('win');
} 
export function isLinux(){
    return os.platform().startsWith('linux');
} 
export function isMac(){
    return os.platform().startsWith('darwin');
} 