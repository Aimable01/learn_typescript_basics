import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

//    roles model
enum UserRoles {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
}

//    user model
interface User {
  name: string;
  role: UserRoles;
}

interface RequestExtended extends Request {
  user?: any;
}

//     The users array
const users: User[] = [
  { name: "name1", role: UserRoles.ADMIN },
  { name: "name2", role: UserRoles.GUEST },
  { name: "name3", role: UserRoles.USER },
];

//-----------Middle ware functions

//   Admin check
function isAdmin(req: RequestExtended, res: Response, next: NextFunction) {
  req.user = req.body;
  if (req.user && req.user.role === UserRoles.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
}

//   User check
function isUser(req: RequestExtended, res: Response, next: NextFunction) {
  req.user = req.body;
  if (req.user && req.user.role === UserRoles.USER) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
}

//    Guest check
function isGuest(req: RequestExtended, res: Response, next: NextFunction) {
  req.user = req.body;
  if (req.user && req.user.role === UserRoles.GUEST) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
}

//------------The route endpoints
app.get("/admin/dashboard", isAdmin, (req: RequestExtended, res: Response) => {
  res.status(200).json({ message: "Welcome to the admin dashboard" });
});

app.get("/user/home", isUser, (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the user home page" });
});

app.get("/guest/home", isGuest, (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the guest home page" });
});

app.listen(3000, () => console.log("App running on port 3000."));
