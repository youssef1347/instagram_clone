import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiSend } from "react-icons/fi";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { SideNavbar } from "../../components/SideNavbar/SideNavbar";
import api from "../../utils/api";
import "./Messages.css";

const getOtherParticipant = (conversation, currentUserId) => {
  return conversation?.participants?.find(
    (participant) => participant._id !== currentUserId,
  );
};

const getAvatarSrc = (profilePic) => {
  if (!profilePic)
    return "${import.meta.env.VITE_BACKEND_URL}/uploads/default-profile-pic.jpg";
  if (profilePic.startsWith("http")) return profilePic;
  return `${import.meta.env.VITE_BACKEND_URL}/${profilePic}`;
};

const formatMessageTime = (createdAt) => {
  if (!createdAt) return "";

  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Messages = () => {
  const { user } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const activeUser = useMemo(
    () => getOtherParticipant(activeConversation, user?._id),
    [activeConversation, user?._id],
  );

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const response = await api.get("/api/chats");
        console.log(response);
        setConversations(response.data.conversations || []);
      } catch (error) {
        toast.error("Failed to load chats");
        console.log(error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation?._id) return;

      try {
        setIsLoadingMessages(true);
        const response = await api.get(
          `/api/chats/${activeConversation._id}/messages`,
        );
        setMessages(response.data.messages || []);
        await api.patch(`/api/chats/${activeConversation._id}/read`);
      } catch (error) {
        toast.error("Failed to load messages");
        console.log(error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeConversation?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return undefined;

    const socket = io("${import.meta.env.VITE_BACKEND_URL}", {
      auth: { token },
      withCredentials: true,
    });

    socket.on("message:new", ({ conversation, message }) => {
      setConversations((prevConversations) => {
        const withoutConversation = prevConversations.filter(
          (item) => item._id !== conversation._id,
        );
        return [conversation, ...withoutConversation];
      });

      setActiveConversation((current) => {
        if (current?._id === conversation._id) {
          setMessages((currentMessages) => {
            const exists = currentMessages.some(
              (item) => item._id === message._id,
            );
            return exists ? currentMessages : [...currentMessages, message];
          });
          api.patch(`/api/chats/${conversation._id}/read`).catch(console.log);
          return conversation;
        }

        toast(`${message.sender?.username || "Someone"} sent you a message`);
        return current;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      const trimmed = searchQuery.trim();

      if (!trimmed) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await api.get(
          `/api/user/search?query=${encodeURIComponent(trimmed)}`,
        );
        setSearchResults(response.data.users || []);
      } catch (error) {
        console.log(error);
        setSearchResults([]);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const openConversationWithUser = async (selectedUser) => {
    try {
      const response = await api.post(`/api/chats/with/${selectedUser._id}`);
      const conversation = response.data.conversation;

      setConversations((prevConversations) => {
        const withoutConversation = prevConversations.filter(
          (item) => item._id !== conversation._id,
        );
        return [conversation, ...withoutConversation];
      });
      setActiveConversation(conversation);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      toast.error("Failed to open chat");
      console.log(error);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!activeConversation?._id || !messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await api.post(
        `/api/chats/${activeConversation._id}/messages`,
        { text: messageText },
      );

      setMessageText("");
      setMessages((currentMessages) => [
        ...currentMessages,
        response.data.message,
      ]);
      setConversations((prevConversations) => {
        const withoutConversation = prevConversations.filter(
          (item) => item._id !== response.data.conversation._id,
        );
        return [response.data.conversation, ...withoutConversation];
      });
      setActiveConversation(response.data.conversation);
    } catch (error) {
      toast.error("Failed to send message");
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="messages-page">
      <SideNavbar />
      <main className="messages-main">
        <aside className="messages-sidebar">
          <div className="messages-sidebar-header">
            <h1>Messages</h1>
          </div>

          <div className="messages-search">
            <FiSearch />
            <input
              type="text"
              placeholder="Search people"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="messages-search-results">
              {searchResults.map((result) => (
                <button
                  type="button"
                  key={result._id}
                  onClick={() => openConversationWithUser(result)}
                >
                  <img
                    src={getAvatarSrc(result.profilePic)}
                    alt={result.username}
                  />
                  <span>{result.username}</span>
                </button>
              ))}
            </div>
          )}

          <div className="conversation-list">
            {isLoadingConversations ? (
              <p className="messages-empty">Loading chats...</p>
            ) : conversations.length === 0 ? (
              <p className="messages-empty">
                Search for someone to start chatting.
              </p>
            ) : (
              conversations.map((conversation) => {
                const participant = getOtherParticipant(
                  conversation,
                  user?._id,
                );
                return (
                  <button
                    type="button"
                    key={conversation._id}
                    className={`conversation-item ${
                      activeConversation?._id === conversation._id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <img
                      src={getAvatarSrc(participant?.profilePic)}
                      alt={participant?.username || "User"}
                    />
                    <span className="conversation-copy">
                      <strong>{participant?.username || "Unknown User"}</strong>
                      <span>
                        {conversation.lastMessage?.text || "No messages yet"}
                      </span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="chat-panel">
          {activeConversation ? (
            <>
              <header className="chat-header">
                <img
                  src={getAvatarSrc(activeUser?.profilePic)}
                  alt={activeUser?.username || "User"}
                />
                <div>
                  <h2>{activeUser?.username || "Unknown User"}</h2>
                  <p>@{activeUser?.username || "user"}</p>
                </div>
              </header>

              <div className="chat-messages">
                {isLoadingMessages ? (
                  <p className="messages-empty">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="messages-empty">Say hello.</p>
                ) : (
                  messages.map((message) => {
                    const isMine = message.sender?._id === user?._id;
                    return (
                      <div
                        key={message._id}
                        className={`message-row ${isMine ? "mine" : "theirs"}`}
                      >
                        <div className="message-bubble">
                          <p>{message.text}</p>
                          <span>{formatMessageTime(message.createdAt)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-compose" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder="Message..."
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || isSending}
                  title="Send message"
                >
                  <FiSend />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-placeholder">
              <h2>Your messages</h2>
              <p>Pick a conversation or search for someone to start one.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
