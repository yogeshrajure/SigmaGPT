import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect ,useRef } from "react";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        options
      );

      const res = await response.json();

      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
      setIsOpen(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-chevron-down"></i>
        </span>

        <div ref={dropdownRef}>
          <div
            className="userIconDiv"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>

          {isOpen && (
            <div className="dropDown">
              <div className="userInfo">
                <div className="userAvatar">
                  <i className="fa-solid fa-user"></i>
                </div>

                <div className="userDetails">
                  <h4>{user?.username}</h4>
                </div>
              </div>

              <hr />

              <div className="dropDownItem">
                <i className="fa-solid fa-gear"></i> Settings
              </div>

              <div className="dropDownItem">
                <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
              </div>

              <div className="dropDownItem" onClick={handleLogout}>
                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
              </div>
            </div>
          )}
        </div>
      </div>

      <Chat />

      <ScaleLoader color="#fff" loading={loading} />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : null)}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;