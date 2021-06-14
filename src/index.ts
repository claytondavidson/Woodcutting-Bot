import {
  mouseClick,
  getPixelColor,
  screen,
  keyToggle,
  moveMouseSmooth,
} from "robotjs";

const main = () => {
  console.log("A simple woodcutting bot made by Clayton Davidson");
  console.log("Starting...");
  sleep(4000);

  while (true) {
    const tree = findTree();
    if (!tree) {
      rotateCamera();
      continue;
    }

    moveMouseSmooth(tree.x, tree.y);
    mouseClick();
    sleep(3000);

    dropLogs();
  }
};

const dropLogs = () => {
  const inventory_x = 1736;
  const inventory_y = 806;
  const inventory_log_color = "473e15";

  let pixel_color = getPixelColor(inventory_x, inventory_y);

  let wait_cycles = 0;
  const max_wait_cycles = 9;
  while (pixel_color != inventory_log_color && wait_cycles < max_wait_cycles) {
    sleep(1000);
    pixel_color = getPixelColor(inventory_x, inventory_y);
    wait_cycles++;
  }

  if (pixel_color === inventory_log_color) {
    moveMouseSmooth(inventory_x, inventory_y);
    mouseClick("right");
    sleep(300);
    moveMouseSmooth(inventory_x, inventory_y + 40);
    mouseClick();
    sleep(1000);
  }
};

const findTree = () => {
  const x = 300,
    y = 300,
    width = 1300,
    height = 700;
  const img = screen.capture(x, y, width, height);
  const tree_colors = [
    "16150b",
    "433d22",
    "605830",
    "15130a",
    "16150a",
    "101008",
    "121209",
    "494326",
    "564e2c",
  ];

  for (let i = 0; i < 500; i++) {
    const random_x = getRandomInt(0, width - 1);
    const random_y = getRandomInt(0, height - 1);
    const sample_color = img.colorAt(random_x, random_y);

    if (tree_colors.includes(sample_color)) {
      const screen_x = random_x + x;
      const screen_y = random_y + y;

      if (confirmTree(screen_x, screen_y)) {
        console.log(
          "Found a tree at: " +
            screen_x +
            ", " +
            screen_y +
            " color " +
            sample_color
        );
        return { x: screen_x, y: screen_y };
      } else {
        console.log(
          "Unconfirmed tree at: " +
            screen_x +
            ", " +
            screen_y +
            " color " +
            sample_color
        );
      }
    }
  }

  return false;
};

const rotateCamera = () => {
  console.log("Rotating camera");
  keyToggle("right", "down");
  sleep(1000);
  keyToggle("right", "up");
};

const confirmTree = (screen_x: number, screen_y: number) => {
  moveMouseSmooth(screen_x, screen_y);
  sleep(300);

  const check_x = 158;
  const check_y = 71;
  const pixel_color = getPixelColor(check_x, check_y);

  return pixel_color === "00ffff";
};

const sleep = (ms: number) =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

main();
