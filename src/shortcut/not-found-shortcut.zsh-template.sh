command_not_found_handler() {
  if [ -x ./node_modules/.bin/bluecodex ]; then
    ./node_modules/.bin/bluecodex "command_not_found_handle" "$@"
    rc=$?
    if [ $rc -ne 127 ]; then
      return $rc
    fi
  fi

  # Emulate default "command not found" message
  echo "zsh: command not found: $1"
  return 127
}
