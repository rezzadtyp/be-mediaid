import app from "./app";
import { appConfig } from "./utils/config";

const PORT = appConfig.port || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
