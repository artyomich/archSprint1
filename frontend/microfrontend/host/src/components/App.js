import React, { useEffect, useState } from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

function Register(props) {
  return null;
}

function Login(props) {
  return null;
}

function EditProfilePopup(props) {
  return null;
}

function AddPlacePopup(props) {
  return null;
}

function EditAvatarPopup(props) {
  return null;
}

function ImagePopup(props) {
  return null;
}

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
      React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
      React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  // Состояние для загрузки модулей
  const [authModule, setAuthModule] = useState(null);
  const [cardModule, setCardModule] = useState(null);
  const [profileModule, setProfileModule] = useState(null);

  const history = useHistory();

  // Загрузка модулей через Module Federation
  useEffect(() => {
    import("auth/authUtils")
        .then((module) => setAuthModule(module))
        .catch((error) => console.error("Failed to load auth module:", error));

    import("card/cardUtils")
        .then((module) => setCardModule(module))
        .catch((error) => console.error("Failed to load card module:", error));

    import("profile/profileUtils")
        .then((module) => setProfileModule(module))
        .catch((error) =>
            console.error("Failed to load profile module:", error)
        );
  }, []);

  // Проверка токена при монтировании
  useEffect(() => {
    if (authModule) {
      const token = localStorage.getItem("jwt");
      if (token) {
        authModule
            .checkToken(token)
            .then((res) => {
              setEmail(res.data.email);
              setIsLoggedIn(true);
              history.push("/");
            })
            .catch((err) => {
              localStorage.removeItem("jwt");
              console.log(err);
            });
      }
    }
  }, [authModule, history]);

  // Обработчики событий
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(userUpdate) {
    if (profileModule) {
      profileModule
          .setUserInfo(userUpdate)
          .then((newUserData) => {
            setCurrentUser(newUserData);
            closeAllPopups();
          })
          .catch((err) => console.log(err));
    }
  }

  function handleUpdateAvatar(avatarUpdate) {
    if (profileModule) {
      profileModule
          .setUserAvatar(avatarUpdate)
          .then((newUserData) => {
            setCurrentUser(newUserData);
            closeAllPopups();
          })
          .catch((err) => console.log(err));
    }
  }

  function handleCardLike(card) {
    if (cardModule) {
      const isLiked = card.likes.some((i) => i._id === currentUser._id);
      cardModule
          .changeLikeCardStatus(card._id, !isLiked)
          .then((newCard) => {
            setCards((cards) =>
                cards.map((c) => (c._id === card._id ? newCard : c))
            );
          })
          .catch((err) => console.log(err));
    }
  }

  function handleCardDelete(card) {
    if (cardModule) {
      cardModule
          .removeCard(card._id)
          .then(() => {
            setCards((cards) => cards.filter((c) => c._id !== card._id));
          })
          .catch((err) => console.log(err));
    }
  }

  function handleAddPlaceSubmit(newCard) {
    if (cardModule) {
      cardModule
          .addCard(newCard)
          .then((newCardFull) => {
            setCards([newCardFull, ...cards]);
            closeAllPopups();
          })
          .catch((err) => console.log(err));
    }
  }

  function onRegister({ email, password }) {
    if (authModule) {
      authModule
          .register(email, password)
          .then((res) => {
            setTooltipStatus("success");
            setIsInfoToolTipOpen(true);
            history.push("/signin");
          })
          .catch((err) => {
            setTooltipStatus("fail");
            setIsInfoToolTipOpen(true);
          });
    }
  }

  function onLogin({ email, password }) {
    if (authModule) {
      authModule
          .login(email, password)
          .then((res) => {
            setIsLoggedIn(true);
            setEmail(email);
            history.push("/");
          })
          .catch((err) => {
            setTooltipStatus("fail");
            setIsInfoToolTipOpen(true);
          });
    }
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    history.push("/signin");
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page__content">
          <Header email={email} onSignOut={onSignOut} />
          <Switch>
            <ProtectedRoute
                exact
                path="/"
                component={Main}
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                loggedIn={isLoggedIn}
            />
            <Route path="/signup">
              <Register onRegister={onRegister} />
            </Route>
            <Route path="/signin">
              <Login onLogin={onLogin} />
            </Route>
          </Switch>
          <Footer />
          <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onUpdateUser={handleUpdateUser}
              onClose={closeAllPopups}
          />
          <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onAddPlace={handleAddPlaceSubmit}
              onClose={closeAllPopups}
          />
          <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
          <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onUpdateAvatar={handleUpdateAvatar}
              onClose={closeAllPopups}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip
              isOpen={isInfoToolTipOpen}
              onClose={closeAllPopups}
              status={tooltipStatus}
          />
        </div>
      </CurrentUserContext.Provider>
  );
}

export default App;