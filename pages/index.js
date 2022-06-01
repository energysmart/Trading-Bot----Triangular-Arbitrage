import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { Component } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import SpotTable from "../components/table";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { spotted: [] };
  }

  generateMetadata = async () => {
    let res = await axios({
      method: "get",
      url: "/api/generate_meta",
    });
    let result = await res.data;
    alert("metadata generated: " + result.success);
    return;
  };

  spotArbitrage = () => {
    return setInterval(async () => {
      let res = await axios({
        method: "get",
        url: "/api/spot_arbitrage",
      });
      let result = await res.data;
      // alert("arbitrage spotted: " + result.success);
      this.setState({
        spotted: [...result.data],
      });
      // alert(this.state.spotted);
      return;
    }, 5000);
  };

  componentWillUnmount() {
    clearInterval(this.spotArbitrage());
  }

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <Stack spacing={2} direction="row">
            <Button onClick={() => this.generateMetadata()} variant="outlined">
              Generate Metadata
            </Button>
            <Button onClick={() => this.spotArbitrage()} variant="outlined">
              Start Spotting Triangular Arbtrage
            </Button>
          </Stack>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Next.js!</a> integrated with{" "}
            <a href="https://mui.com/">Material-UI!</a>
          </h1>
          <div className={styles.description}>
            <SpotTable spotted={this.state.spotted} />
            <code className={styles.code}>pages/index.js</code>
          </div>
        </main>
      </div>
    );
  }
}
export default Home;
