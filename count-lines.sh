#!/usr/bin/env bash

files=$(find src db test -type f)
total=0

echo "total	file	path"

for f in $files; do
  wc_out=($(wc -l $f));
  # echo '$wc_out';
  lc=$wc_out; #[0];
  # echo "wc_out='$wc_out', lc='$lc'"
  total=$((total+lc));
  echo "$total	$lc	$f";
done

echo "A total of ${total} lines in $(echo $(echo $files | wc -w) ) files. (src/db/test)"
