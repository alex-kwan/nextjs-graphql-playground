import { Message } from "@/app/api/graphql/types";
import styles from "@/app/page.module.css";
import { CombinedGraphQLErrors, ErrorLike } from "@apollo/client";

export type GraphqlPlaygroundViewProps = {
  serverTime: string,
  loading: boolean,
  dashboardError: ErrorLike | undefined,
  hello: string,
  messages: string[],
  messagesV2: Message[],
  addError: ErrorLike | undefined,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  isAdding: boolean,
};

export function GraphqlPlaygroundView(props: GraphqlPlaygroundViewProps) {

const graphqlErrors = CombinedGraphQLErrors.is(props.addError) ? props.addError.errors : [];

  let combinedMessages = [...props.messages, ...props.messagesV2.map((message) => message.text)];
  return <main className={styles.main}>
      <h1 className={styles.title}>Next.js + GraphQL Playground</h1>
      <p className={styles.subtitle}>
        Query and mutate data from the GraphQL API at <code>/api/graphql</code>.
      </p>
      <p className={styles.subtitle}>
        Server Time : {props.serverTime}
      </p>

      <section className={styles.card}>
        <h2>Server greeting</h2>
        {props.loading && <p>Loading query...</p>}
        {props.dashboardError && <p className={styles.error}>{props.dashboardError.message}</p>}
        {!props.loading && !props.dashboardError && <p>{props.hello}</p>}
      </section>

      <section className={styles.card}>
        <h2>Messages</h2>
        {props.loading && <p>Loading messages...</p>}
        {!props.loading && combinedMessages.length === 0 && <p>No messages yet.</p>}
        <ul className={styles.messages}>
          {combinedMessages.map((entry: string, index: number) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ul>
      </section>
      
      <p data-testid="errorSpot" className={styles.error}>
        {graphqlErrors.length > 0 && ((graphqlErrors[0].extensions?.fields as { message: string } | undefined)?.message)}
      </p>

      <form className={styles.form} onSubmit={props.onSubmit}>
        <label htmlFor="message">Add message</label>
        <input
          id="message"
          name="message"
          value={props.message}
          onChange={(event) => props.setMessage(event.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" disabled={props.isAdding}>
          {props.isAdding ? "Saving..." : "Run mutation"}
        </button>
      </form>
    </main>
}

export default GraphqlPlaygroundView;
