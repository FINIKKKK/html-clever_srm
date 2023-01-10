// Основной модуль
import gulp from "gulp";
// node-modules
import * as nodePath from "path";
// Все Плагины
import plumber from "gulp-plumber"; // Обработка ошибок
import notify from "gulp-notify"; // Сообщения (подсказки)
import browserSync from "browser-sync"; // Локальный сервер
import newer from "gulp-newer"; // Проверка обновления
import ifPlugin from "gulp-if"; // Условное ветвление
import fileinclude from "gulp-file-include"; // Соединение файлов в один
import webpHtml from "gulp-webp-html-nosvg"; // Вставка webp в html
import versionNumber from "gulp-version-number"; //
import htmlmin from "gulp-htmlmin"; // Минифицируем HTML
import del from "del"; // Удаление файлов
import sass from "gulp-sass"; // Преобразование sass в css
import rename from "gulp-rename"; // Переименование файлов
import cleanCss from "gulp-clean-css"; // Сжатие CSS файла
import webpcss from "gulp-webpcss"; // Вывод WEBP изображений
import autoprefixer from "gulp-autoprefixer"; // Добавление вендорных префиксов
import groupCssMediaQueries from "gulp-group-css-media-queries"; // Группировка медиа запросов
import minify from "gulp-minify"; // Минифицируем js
import webp from 'gulp-webp'; // Создаем webp
import imagemin from "gulp-imagemin"; // Минифицируем картинки
import fs from "fs"; // Для шрифтов
import fonter from "gulp-fonter"; // Для шрифтов
import ttf2woff2 from "gulp-ttf2woff2"; // Преобразование ttf в woff
import gulpSvgSprite from "gulp-svg-sprite"; // Создание спрайтов svg

// Главные директории
const rootFolder = nodePath.basename(nodePath.resolve());
const buildFolder = `./dist`;
const srcFolder = `./src`;

// Пути
const path = {
  build: {
    html: `${buildFolder}/`,
    css: `${buildFolder}/css/`,
    js: `${buildFolder}/js/`,
    img: `${buildFolder}/img/`,
    fonts: `${buildFolder}/fonts/`,
    files: `${buildFolder}/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/app.scss`,
    js: `${srcFolder}/js/script.js`,
    img: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
    svgIcons: `${srcFolder}/img/**/*.svg`,
    svg: `${srcFolder}/img/**/*.svg`,
    files: `${srcFolder}/files/**/*.*`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    scss: `${srcFolder}/scss/**/*.scss`,
    js: `${srcFolder}/js/**/*.js`,
    img: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
    svgIcons: `${srcFolder}/img/**/*.svg`,
    fonts: `${srcFolder}/fonts/**/*.*`,
    files: `${srcFolder}/files/**/*.*`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
};

// Передаем значения в глобальную переменную
global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
};

// Функция для обновления изменений в браузере
const server = () => {
  browserSync.init({
    server: {
      baseDir: `${path.build.html}`,
    },
    notify: false,
    port: 3000,
    open: false,
  });
};

// Удаление папки dist
const reset = () => {
  return del(path.clean);
};

// Функция копирования из папки files
const copy = () => {
  return gulp.src(path.src.files).pipe(gulp.dest(path.build.files));
};

// Функция преобразования html
const html = () => {
  return (
    gulp
      .src(path.src.html)
      .pipe(
        plumber(
          notify.onError({
            title: "HTML",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(fileinclude())
      // .pipe(webpHtml())
      .pipe(ifPlugin(app.isBuild, htmlmin({ collapseWhitespace: true })))
      .pipe(
        ifPlugin(
          app.isBuild,
          versionNumber({
            value: "%DT%",
            append: {
              key: "_v",
              cover: 0,
              to: ["css", "js"],
            },
          })
        )
      )
      .pipe(gulp.dest(path.build.html))
      .pipe(browserSync.stream())
  );
};

// Функция преобразования scss
const scss = () => {
  return (
    gulp
      .src(path.src.scss, { sourcemaps: true })
      .pipe(
        plumber(
          notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(
        sass({
          outputStyle: "expanded",
        })
      )
      .pipe(groupCssMediaQueries())
      .pipe(webpcss(
          {
              webpClass: ".webp",
              noWebpClass: ".no-webp",
          }
      ))
      .pipe(
        autoprefixer({
          grid: true,
          overrideBrowserslist: ["last 3 versions"],
          cascade: true,
        })
      )
      .pipe(rename("style.css"))
      .pipe(gulp.dest(path.build.css))
      .pipe(cleanCss())
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest(path.build.css))
      .pipe(browserSync.stream())
  );
};

// Функция преобразования js
const js = () => {
  return gulp
    .src(path.src.js, { sourcemaps: true })
    .pipe(
      plumber(
        notify.onError({
          title: "JS",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(fileinclude())
    .pipe(minify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
};

// Функция преобразования картинок
const img = () => {
  return (
    gulp
      .src(path.src.img)
      .pipe(
        plumber(
          notify.onError({
            title: "IMAGES",
            message: "Error: <%= error.message %>",
          })
        )
      )
      .pipe(newer(path.build.img))
      .pipe(webp())
      .pipe(gulp.dest(path.build.img))
      .pipe(gulp.src(path.src.img))
      .pipe(newer(path.build.img))
      .pipe(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimiazationLevel: 3, // 0 to 7
        })
      )
      .pipe(gulp.dest(path.build.img))
      .pipe(gulp.src(path.src.svg))
      .pipe(gulp.dest(path.build.img))
      .pipe(browserSync.stream())
  );
};

// Функции преобразования шрифтов
const otf2ttf = () => {
  // Ищем файлы шрифтов .otf
  return (
    gulp
      .src(`${path.srcFolder}/fonts/*.otf`, {})
      .pipe(
        plumber(
          notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>",
          })
        )
      )
      // Конвертация в .ttf
      .pipe(
        fonter({
          formats: ["ttf"],
        })
      )
      // Выгружвем в исходную папку
      .pipe(gulp.dest(`${path.srcFolder}/fonts/`))
  );
};
const ttf2woff = () => {
  // Ищем файлы шрифтов .ttf
  return (
    gulp
      .src(`${path.srcFolder}/fonts/*.ttf`, {})
      .pipe(
        plumber(
          notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>",
          })
        )
      )
      // Конвертация в .woff
      .pipe(
        fonter({
          formats: ["woff"],
        })
      )
      // Выгружвем в папку с результтом
      .pipe(gulp.dest(`${path.build.fonts}`))
      // Ищем файлы шрифтов .ttf
      .pipe(gulp.src(`${path.srcFolder}/fonts/*.ttf`, {}))
      // Конвертация в .woff2
      .pipe(ttf2woff2())
      // Выгружвем в папку с результтом
      .pipe(gulp.dest(`${path.build.fonts}`))
  );
};
const fontsStyle = () => {
  // Файл стилей подключения шрифтов
  let fontsFile = `${path.srcFolder}/scss/assets/fonts.scss`;
  // Проверяем существуют ли файлы шрифтов
  fs.readdir(path.build.fonts, function (err, fontsFiles) {
    if (fontsFiles) {
      // Проверяем пуст ли файл
      let file_content = fs.readFileSync(fontsFile);
      if (file_content == "") {
        // Если файла нет, создаем его
        createFontStyles(fontsFile, fontsFiles);
      } else {
        // Удаляем файл и созлаем новыми настройками
        fs.truncate(fontsFile, 0, function () {
          console.log("done");
        });
        createFontStyles(fontsFile, fontsFiles);
      }
    }
  });
  return gulp.src(`${path.srcFolder}`);
  function cb() {}
  function createFontStyles(fontsFile, fontsFiles) {
    fs.writeFile(fontsFile, "", cb);
    let newFileOnly;
    for (var i = 0; i < fontsFiles.length; i++) {
      // Записываем подключения шрифтов в файл стилей
      let fontFileName = fontsFiles[i].split(".")[0];
      if (newFileOnly !== fontFileName) {
        let fontName = fontFileName.split("-")[0]
          ? fontFileName.split("-")[0]
          : fontFileName;
        let fontWeight = fontFileName.split("-")[1]
          ? fontFileName.split("-")[0]
          : fontFileName;
        if (fontWeight.toLowerCase() === "thin") {
          fontWeight = 100;
        } else if (fontWeight.toLowerCase() === "extralight") {
          fontWeight = 200;
        } else if (fontWeight.toLowerCase() === "light") {
          fontWeight = 300;
        } else if (fontWeight.toLowerCase() === "medium") {
          fontWeight = 500;
        } else if (fontWeight.toLowerCase() === "semibold") {
          fontWeight = 600;
        } else if (fontWeight.toLowerCase() === "bold") {
          fontWeight = 700;
        } else if (
          fontWeight.toLowerCase() === "extrabold" ||
          fontWeight.toLowerCase() === "heavy"
        ) {
          fontWeight = 800;
        } else if (fontWeight.toLowerCase() === "black") {
          fontWeight = 900;
        } else {
          fontWeight = 400;
        }
        fs.appendFile(
          fontsFile,
          `@font-face{\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
          cb
        );
        newFileOnly = fontFileName;
      }
    }
  }
};

// Функция создания svg-спрайтов
const svgSprite = () => {
  return gulp
    .src(path.src.svgIcons)
    .pipe(
      plumber(
        notify.onError({
          title: "SVG",
          message: "Error: <%= error.message %>",
        })
      )
    )
    .pipe(
      gulpSvgSprite({
        mode: {
          stack: {
            sprite: `../icons/icons.svg`,
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  {
                    removeAttrs: {
                      attrs: ["fill", "stroke"],
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    )
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
};

// Последовательная обработка шрифтов
const fonts = gulp.series(otf2ttf, ttf2woff, fontsStyle);

// Наблюдатель за изменениями в файлах
function watcher() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.img, img);
  gulp.watch(path.watch.svgIcons, svgSprite);
  gulp.watch(path.watch.fonts, fonts);
}

// Основные задачи
const mainTasks = gulp.series(
  fonts,
  gulp.parallel(copy, html, scss, js, img, svgSprite)
);

// Построение сценариев выполнения задач
const start = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const dev = gulp.series(reset, mainTasks);
const build = gulp.series(reset, mainTasks);

// Экспорт сценариев
export { dev };
export { build };

// Выполлнение сценария по умолчанию
gulp.task("default", start);
