# Shell

## 一行执行多个命令

`;`用于区分多个命令，各命令直接的执行互不影响

```bash
> cat 1.txt; ls
cat: 1.txt: No such file or directory
2.txt
```

**&&**前面的命令执行成功才会执行后面的命令

```bash
> cat 1.txt && ls
cat: 1.txt: No such file or directory
```

`||`当前面的命令执行失败后才会执行后面的命令

```bash
> cat 1.txt || touch 1.txt; ls
cat: 1.txt: No such file or directory
1.txt 2.txt
```



## 默认确认

有些命令在执行时需要键入Y/n进行确认，在执行命令时添加`-y`参数，可以默认进行确认
