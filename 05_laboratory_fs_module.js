const fs = require("fs");

fs.readFile("sample.txt", "utf8", (err, data) => {
  if (err) {
    console.error("the file does not exist:", err);
  } else {
    console.log("File Content:", data);
  }
  fs.writeFile("newfile.txt", "This is a new File", (err) => {
    if (err) {
      console.error("the file doesn't exist", err);
    } else {
      console.log("The file is successfully");
    }
  });
  fs.appendFile("sample.txt", "\nAppend content.", (err) => {
    if (err) {
      console.log("The file does not exist:", err);
    } else {
      console.log("The file is successfully add.");
    }
  });

  fs.unlink("newfile.txt", (err) => {
    if (err) {
      console.log("The file doesn't exist.:", err);
    } else {
      console.log("File is deleted.");
    }
  });
});
