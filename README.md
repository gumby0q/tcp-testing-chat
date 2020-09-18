# chat-example

This is the source code for a very simple chat example used for
the [Getting Started](http://socket.io/get-started/chat/) guide
of the Socket.IO website.

# app running

## project setup
1. ```npm install forever -g```

2. ```git clone git@github.com:gumby0q/tcp-testing-chat.git```

    or

    ```git clone https://github.com/gumby0q/tcp-testing-chat.git```

3. ```npm i```
4. ```cp .example.config.json .config.json``` 
    
    (correct configs in the `.config.json` if you need it)

### change server adres in `index.html` file to yours in the line: ```var socket = io('http://localhost:3100');```


## start app with 
```forever start index.js```

## stop app with 
```forever stop index.js```

## restart app with 
```forever restart index.js```