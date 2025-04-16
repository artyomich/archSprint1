const getResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

export const getCardList = () => {
    return fetch(`${this._address}/${this._groupId}/cards`, {
        headers: {
            authorization: this._token,
        },
    })
        .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

export const addCard = ({ name, link }) => {
    return fetch(`${this._address}/${this._groupId}/cards`, {
        method: 'POST',
        headers: {
            authorization: this._token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            link,
        }),
    })
        .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

export const removeCard = (cardID) => {
    return fetch(`${this._address}/${this._groupId}/cards/${cardID}`, {
        method: 'DELETE',
        headers: {
            authorization: this._token,
        },
    })
        .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

export const changeLikeCardStatus = (cardID, like) => {
    // Обычная реализация: 2 разных метода для удаления и постановки лайка.
    return fetch(`${this._address}/${this._groupId}/cards/like/${cardID}`, {
        method: like ? 'PUT' : 'DELETE',
        headers: {
            authorization: this._token,
            'Content-Type': 'application/json',
        },
    })
        .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}