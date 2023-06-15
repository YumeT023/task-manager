import Head from "next/head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { differenceInDays, format } from "date-fns";

/**
 Calculates the time difference between the server time and client time.
 @param {Date} serverTime - The server time.
 @param {Date} clientTime - The client time.
 @returns {string} The time difference in the format "{days} days, {hours} hours, {minutes} minutes, {seconds} seconds".
 */
const calculateTimeDifference = (server: Date, client: Date) => {
  const diffInDays = differenceInDays(server, client);
  const diffDate = new Date(
    // 24 hour, 60 minutes, 60 seconds, 1000 millis
    server.getTime() + diffInDays * 24 * 60 * 60 * 1000
  );
  return format(diffDate, "dd-MM-yyyy hh:mm:ss");
};

export default function Home({ serverTime }: { serverTime: Date }) {
  const router = useRouter();

  const dateDiff = calculateTimeDifference(new Date(serverTime), new Date());

  const moveToTaskManager = () => {
    router.push("/tasks");
  };

  return (
    <>
      <Head>
        <title>Web 2 - Exam TD</title>
        <meta name="description" content="Just an exam" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>The easiest exam you will ever find</h1>
        <div>
          {/* Display here the server time (DD-MM-AAAA HH:mm)*/}
          <p>
            Server time:{" "}
            <span className="serverTime">
              {format(new Date(serverTime), `dd-MM-yyyy hh:mm`)}
            </span>
          </p>

          {/* Display here the time difference between the server side and the client side */}
          <p>
            Time diff: <span className="serverTime">{dateDiff}</span>
          </p>
        </div>

        <div>
          <button onClick={moveToTaskManager}>Go to task manager</button>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const serverTime = new Date().toISOString();
  return {
    props: {
      serverTime,
    },
  };
};
