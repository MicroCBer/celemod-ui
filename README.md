# sciter-preact-template
Simple setup using Parcel, Preact, and TypeScript, whose hot reloading and css replacing works in sciter.

# How to use

1. Install: `yarn`
2. Develop and debug `yarn start`
  Note that you should use a html like this for debug entrypoint:
```html
<html lang="en">
    <script>
        setTimeout(()=>{
            Window.this.load("http://localhost:1234/");
        },10);
    </script>
</html>
```

Hot reloading and CSS replacing should work out of box.
