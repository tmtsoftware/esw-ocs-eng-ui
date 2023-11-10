echo "running lint checks ";
pnpm run eslint:check;
lintStatus=$?;
pnpm run style:check
styleStatus=$?;
if [ $lintStatus == 0 ] && [ $styleStatus == 0 ]; then
  echo "\n commiting code ..."
  exit 0;

else
echo "\n error detected ..."
  exit 1;
fi
