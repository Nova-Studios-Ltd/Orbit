import WorkboxWebpackPlugin from "workbox-webpack-plugin";

const module = {
  webpack: {
    plugins: {
      add: [
        new WorkboxWebpackPlugin.GenerateSW()
      ]
    }
  }
}

export default module;
