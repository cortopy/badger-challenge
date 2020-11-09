# Challenge

In order to run this challenge, first build the application with

```
yarn build
```

or if using npm `npm run build`.

And then

```
yarn play <filename>
```

where `<filename>` is a path to a file with input, for example

```
yarn play fixtures/working.txt
```

## What I've done

- I worked most of the time (nearly the first 2 hours) on input validation. I did this because in my experience text input from a file can be inconsistent and any transformation could fail because of it. This also helped me understand the type of data that the application runs with
- Quite a few unit tests for the input module, although I had to cut it short to focus on the rest
- Transformations of input into output for the first case. Cases 2 and 3 are failing (as per tests)

## What remains to do

- Fix whatever is failing for cases 2 and 3
- Improve error messaging (messages are too generic at this time and don't help a lot)
- Unit tests for the movement and instructions transformations
- Implement the logic for robot 'scent'
