// Modified from the node.js definitions.
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/fs.d.ts

import {
    Dirent,
    FSWatcher,
    NoParamCallback,
    PathLike,
    RmDirOptions,
    WriteFileOptions,
    Stats,
    symlink as symlinkNS,
    MakeDirectoryOptions,
} from "fs";
export * from "fs";

declare const fs: any