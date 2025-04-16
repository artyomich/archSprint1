**Задание 1**
Нужно разделить проект Mesto на несколько микрофронтендов.

Из двух вариантов Single SPA и Module Federation выбираем последний, используем DDD-подход, или Domain-Driven Design (предметно-ориентированное проектирование), характеризуется разбиением на контексты. Это некоторая область программы, которая может быть в достаточной степени изолированной. Один контекст может взаимодействовать с другими контекстами. 
Разбиваем на следующие обособленные микрофронтенды:

    хостовое приложение (главный связующий): 
    host
    
    дочерние приложения и используемые методы: 
    1. auth
    	-login
    	-register
    2. card
    	-create
    	-delete
    	-like/dislike
    	-imagePopup
    3. profile
    	-editAvatarPopup
    	-editProfilePopup

Все компоненты уникальны, кроме popupWithForm – компонент диалогового окна сохранения используется как в card, так и в profile.

Используем инструмент сборки Vite в него добавляю vite-plugin-federation для реализации Module Federation в сборке.

vite.config.js для Host свои правила, для удаленных модулей другие.

Переписывание App.js для использования Module Federation
Цель — заменить статические импорты на динамические импорты через Module Federation

    plugins: [
        federation({
            name: 'auth',
            filename: 'remoteEntry.js',
            exposes: {
                './authUtils': './src/utils/auth.js', // Публикуем auth.js
            },
            shared: ['react', 'react-dom'],
        }),
    ],

App.js делаем  Динамический импорт через Module Federation

useEffect(() => {
        import('auth/authUtils').then((module) => {
            setAuthUtils(module);
        }).catch((error) => {
            console.error('Failed to load auth module:', error);
        });
    }, []);

Пункт 3. Реализовать запуск не удалось.
Compiled with problems:
×
ERROR in ./src/components/App.js 60:4-28
Module not found: Error: Can't resolve 'auth/authUtils' in '/home/artem/dev/yp/architecture-sprint-1/frontend/microfrontend/host/src/components'
ERROR in ./src/components/App.js 61:4-28
Module not found: Error: Can't resolve 'card/cardUtils' in '/home/artem/dev/yp/architecture-sprint-1/frontend/microfrontend/host/src/components'
ERROR in ./src/components/App.js 62:4-34
Module not found: Error: Can't resolve 'profile/profileUtils' in '/home/artem/dev/yp/architecture-sprint-1/frontend/microfrontend/host/src/components'
ERROR in ./src/components/Main.js 6:0-26
Module not found: Error: Can't resolve './Card' in '/home/artem/dev/yp/architecture-sprint-1/frontend/microfrontend/host/src/components'

**Задание 2**
Добавлен брокер сообщений для асинхронных вызовов.
Все взаимодействия сделаны через гейтвэй.
Добавлен отдельный интерфейс для персонала.

Выполнено в DRAW.io ссылка на файл:
https://github.com/artyomich/archSprint1_2/blob/master/arch_template_task2.drawio
