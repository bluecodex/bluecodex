command_not_found_handle() {
  if [ -x ./node_modules/.bin/bluecodex ]; then
    ./node_modules/.bin/bluecodex "command_not_found_handle" "$@"
    rc=$?
    if [ $rc -ne 127 ]; then
      return $rc
    fi
  fi

  # Emulate default "command not found" message
  echo "bash: $1: command not found"
  return 127
}
