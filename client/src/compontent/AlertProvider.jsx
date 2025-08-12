import { createContext, useContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const AlertCtx = createContext(null);
export const useAlert = () => useContext(AlertCtx);

export const AlertProvider = ({ children }) => {
  const [s, setS] = useState({ open: false, title: "", message: "" });

  const show = ({ title = "", message = "" }) =>
    new Promise((resolve) => setS({ open: true, title, message, resolve }));

  const close = () => {
    s.resolve?.();
    setS((p) => ({ ...p, open: false }));
  };

  return (
    <AlertCtx.Provider value={{ show }}>
      {children}
      <Dialog
        open={s.open}
        onClose={close}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.25)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.4)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          },
        }}
      >
        {s.title && <DialogTitle>{s.title}</DialogTitle>}
        <DialogContent>
          <Typography>{s.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>OK</Button>
        </DialogActions>
      </Dialog>
    </AlertCtx.Provider>
  );
};
