wait () {
  spin='-\|/'
  i=0
  while true
  do
    i=$(( (i+1) %4 ))
    printf "\r${spin:$i:1}"
    sleep .1
  done
}
