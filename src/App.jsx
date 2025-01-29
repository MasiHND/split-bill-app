import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedfFriend, setSelectedFriend] = useState(null);

  function handlePrev() {
    setShowAddFriendForm((prev) => !prev);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriendForm(false);
    setSelectedFriend(friend);
  }

  function handleFriendSelect(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((s) => (s?.id === friend.id ? null : friend));
    setShowAddFriendForm(false);
  }

  function handleSplitBill(value) {
    setFriends((f) =>
      f.map((friend) =>
        friend.id === selectedfFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleFriendSelect}
          selectedfFriend={selectedfFriend}
        />

        {showAddFriendForm && <AddFriendForm onAddFriend={handleAddFriend} />}

        <button className="button" onClick={handlePrev}>
          {showAddFriendForm ? "Close" : "Add Friend"}
        </button>
      </div>

      {selectedfFriend && (
        <FormSplitBill
          selectedfFriend={selectedfFriend}
          onSplitBill={handleSplitBill}
          key={selectedfFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedfFriend }) {
  return (
    <>
      <ul>
        {friends.map((f) => (
          <FriendItem
            friend={f}
            key={f.id}
            onSelectFriend={onSelectFriend}
            selectedfFriend={selectedfFriend}
          />
        ))}
      </ul>
    </>
  );
}

function FriendItem({ friend, onSelectFriend, selectedfFriend }) {
  const isSelected = selectedfFriend && selectedfFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <span>{friend.name}</span>
      {friend.balance === 0 && (
        <p>
          You & {friend.name} are <br />
          settled up !!! 🎉💸
        </p>
      )}

      {friend.balance < 0 && (
        <p className="red">
          You Owe {friend.name} {Math.abs(friend.balance)}$<br /> 😢😭
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} Owes You {Math.abs(friend.balance)}$<br /> 😎🤑
        </p>
      )}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close!" : "Choose"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    // console.log(newFriend);
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏻‍🤝‍👩🏼Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼️Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <button className="button">Add</button>
    </form>
  );
}

function FormSplitBill({ selectedfFriend, onSplitBill }) {
  const [bill, setBill] = useState(0);
  const [yourShare, setYourShare] = useState("");
  const [paidBy, setPaidBy] = useState("user");
  const paidByFriend = bill ? bill - yourShare : 0;

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !yourShare) return;
    onSplitBill(paidBy === "user" ? paidByFriend : -yourShare);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>
        split with {selectedfFriend.name}{" "}
        <span>
          <img src={selectedfFriend.image} alt={selectedfFriend.name} />
        </span>{" "}
      </h2>
      <label htmlFor="">💸Total Bill Amount</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label htmlFor="">🧑Your Share</label>
      <input
        type="number"
        value={yourShare}
        onChange={(e) =>
          setYourShare(
            Number(e.target.value) > bill ? yourShare : e.target.value
          )
        }
      />

      <label>👩🏻‍🤝‍👩🏼{selectedfFriend.name}'s Share</label>
      <input type="number" disabled value={paidByFriend} />

      <label>💸Who's Paying the Bill?</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedfFriend.name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}
export default App;
