# openwrt-package

```
echo "src-git buxiaomo https://github.com/buxiaomo/openwrt-package.git" >> feeds.conf.default
./scripts/feeds update -a
./scripts/feeds install -a
```

## submodule

### add 

```
git submodule add --force --name <name> <url> <path>
```

### update

```
cd <path>
git pull
```

### delete

```
rm -rf <name>
vim .gitmodules
vim .git/config
rm -rf .git/module/<name>
git rm --cached <name>
```