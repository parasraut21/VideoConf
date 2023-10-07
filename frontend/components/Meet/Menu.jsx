import React, { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import Loader from "./Loader";
import { useGame } from "@/contexts/MeetContext";
import Navbar from './Navbar'
import Footer from './Footer'

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  InputBase,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ScheduleIcon from '@mui/icons-material/Schedule';
import JoinIcon from '@mui/icons-material/GroupAdd';
import VideoCallIcon from '@mui/icons-material/VideoCall';

export default function Menu() {

//
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(""); 
  const [joiningGame, setJoiningGame] = useState(false);
  const [gameId, setGameId] = useState("");

  const { makeCSID, makeOSID } = useGame();

  const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  const handleJoinGameClick = () => {
    console.log("join");
    setJoiningGame(true);
  };

  const handleJoinWithGameId = async () => {
    makeCSID(socket.id);
    socket?.emit("oppoSID", socket.id);
    setLoading(true);
    console.log("Joining game with ID:", gameId);
    router.push("/Meet/" + gameId);
    setLoading(false);
  };

  const socket = useSocket();
  const { username, id } = useUser();
  let showOnline = true;

  useEffect(() => {
    if (!socket) return;
    socket.emit("username", username);
  }, [username, socket]);

  useEffect(() => {
    if (!socket) return;
    async function gotogame(gameId) {
      router.push("/Meet/" + gameId);
    }

    async function gotoram(gameId) {
      router.push("/Meet/" + gameId);
    }

    socket.on("game id", gotogame);
    socket.on("ramdom id", gotoram);
    socket.emit("get-users");
    socket.on("get-users", (_users) => {
      setOnlineUsers(_users);
    });

    return () => {
      socket.off("game id", gotogame);
      socket.off("get-users");
    };
  }, [socket]);




  //
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  const openJoinDialog = () => {
    setIsJoinDialogOpen(true);
  };

  const closeJoinDialog = () => {
    setIsJoinDialogOpen(false);
  };

  const openCopyDialog = () => {
    setIsCopyDialogOpen(true);
  };

  const closeCopyDialog = () => {
    setIsCopyDialogOpen(false);
  };

  const copyLinkToClipboard = () => {
    const linkToCopy = 'https://example.com'; 
    navigator.clipboard.writeText(linkToCopy).then(() => {
      setCopiedLink(linkToCopy);
      setIsSnackbarOpen(true);
    });
  };

  
  const handlePrivateGameClick = () => {
    makeOSID(socket.id);
    socket?.emit("createSID", socket.id);
    setLoading(true);
    socket?.emit("create");
  };

  return (
    <>
<Navbar/>
{showOnline && <div className="fixed top-8 left-8 bg-gray-100 p-2 rounded">Online: {onlineUsers.length}</div>}
    <div
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px', 
            padding: '20px',
            borderRadius: '15px',
            background: 'white',
            boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack sx={[{ marginLeft: '40vw', marginTop: '20vh' }]}>
            <Stack direction={{ xs: 'row' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VideoCallIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
                // onClick={openCopyDialog}
                onClick={handlePrivateGameClick}
              >
                Start
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ScheduleIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
              >
                Schedule
              </Button>
            </Stack>

            <Stack direction={{ xs: 'row' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<JoinIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
                onClick={openJoinDialog}
              >
                Join
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HistoryIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
              >
                History
              </Button>
            </Stack>
          </Stack>
        </div>
      </div>

  
      <Dialog open={isJoinDialogOpen} onClose={closeJoinDialog}>
        <DialogTitle>Join Meeting</DialogTitle>
        <DialogContent>
          <Typography>Enter Meeting ID:</Typography>
          {/* <InputBase placeholder="Meeting ID" /> */}
          <InputBase
            placeholder="Meeting ID"
            value={gameId}
            onChange={handleGameIdChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJoinDialog} color="primary">
            Cancel
          </Button>
          {/* <Button onClick={closeJoinDialog} color="primary">
            Join
          </Button> */}
           <Button onClick={handleJoinWithGameId} color="primary" disabled={loading}>
            {loading ? 'Joining...' : 'Join'}
          </Button>
        </DialogActions>
      </Dialog>

  
      <Dialog open={isCopyDialogOpen} onClose={closeCopyDialog}>
        <DialogTitle>Copy Link to Clipboard</DialogTitle>
        <DialogContent>
          <Button variant="contained" color="primary" onClick={copyLinkToClipboard}>
            Copy to Clipboard
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCopyDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        message={`Link copied: ${copiedLink}`}
      />
         <Footer/>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { useSocket } from "@/contexts/SocketContext";
// import { useUser } from "@/contexts/UserContext";
// import Loader from "./Loader";
// import { useGame } from "@/contexts/MeetContext";





// export default function Menu() {
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState(""); 
//   const [joiningGame, setJoiningGame] = useState(false);
//   const [gameId, setGameId] = useState("");

//   const { makeCSID, makeOSID } = useGame();

//   const handleGameIdChange = (event) => {
//     setGameId(event.target.value);
//   };

//   const handleJoinGameClick = () => {
//     console.log("join");
//     setJoiningGame(true);
//   };

//   const handleJoinWithGameId = async () => {
//     makeCSID(socket.id);
//     socket?.emit("oppoSID", socket.id);
//     setLoading(true);
//     console.log("Joining game with ID:", gameId);
//     router.push("/Meet/" + gameId);
//     setLoading(false);
//   };

//   const socket = useSocket();
//   const { username, id } = useUser();
//   let showOnline = true;

//   useEffect(() => {
//     if (!socket) return;
//     socket.emit("username", username);
//   }, [username, socket]);

//   useEffect(() => {
//     if (!socket) return;
//     async function gotogame(gameId) {
//       router.push("/Meet/" + gameId);
//     }

//     async function gotoram(gameId) {
//       router.push("/Meet/" + gameId);
//     }

//     socket.on("game id", gotogame);
//     socket.on("ramdom id", gotoram);
//     socket.emit("get-users");
//     socket.on("get-users", (_users) => {
//       setOnlineUsers(_users);
//     });

//     return () => {
//       socket.off("game id", gotogame);
//       socket.off("get-users");
//     };
//   }, [socket]);

//   const handlePrivateGameClick = () => {
//     makeOSID(socket.id);
//     socket?.emit("createSID", socket.id);
//     setLoading(true);
//     socket?.emit("create");
//   };

//   return (
//     <>
//       <div className="relative flex items-center justify-center w-full h-screen bg-center  bg-no-repeat bg-cover">
//         <div className="relative h-full">
//           <div className="absolute inset-0 flex items-center justify-center"></div>
//           <div className="flex justify-center items-center h-full ">
//             {loading ? (
//               <Loader />
//             ) : (
//               <div className="max-w-sm bg-white rounded-lg shadow-2xl p-6 bg-orange-400">
//                 <button
//                   onClick={handlePrivateGameClick}
//                   className="menu-Button shadow-2xl bg-customC hover:bg-customh transform hover:scale-105 text-white border-2 border-customC rounded-full py-2 px-6 m-2 focus:outline-none focus:ring focus:border-blue-300"
//                 >
//                   Start Meet
//                 </button>

//                 <button
//                   onClick={handleJoinGameClick}
//                   className="menu-Button shadow-2xl menu-Button-secondary bg-customC hover:bg-customh text-white transform hover:scale-105 border-2 border-customC rounded-full py-2 px-6 m-2 focus:outline-none focus:ring focus:border-blue-300"
//                 >
//                   Join Meet
//                 </button>

//                 {joiningGame && (
//                   <div className="menu-Buttons-1 p-4 rounded-lg shadow-md bg-gray-100">
//                     <input
//                       value={gameId}
//                       onChange={handleGameIdChange}
//                       type="text"
//                       id="input-info"
//                       placeholder="Enter Game ID"
//                       className="w-full shadow-2xl p-2 border-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-300 rounded-md hover:shadow-lg relative z-10"
//                       required
//                     />

//                     <button
//                       onClick={handleJoinWithGameId}
//                       className="menu-Button shadow-2xl bg-orange-400 mt-4 w-full p-2 transform hover:scale-105 text-white bg-customC hover:bg-customh rounded-md focus:outline-none focus:ring focus:border-blue-300"
//                     >
//                       Join with Meet ID
//                     </button>
//                     {loading && <Loader />}
//                   </div>
//                 )}

//                 {showOnline && (
//                   <div className="text-white p-2 font-bold animate-pulse text-bg-customh-500">
//                     Online:{" "}
//                     <span className="font-bold animate-pulse text-bg-customh-500">
//                       {onlineUsers.length}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
