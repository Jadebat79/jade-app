import React, { useEffect, useRef, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

const LIST_NOTES = /* GraphQL */ `
  query ListNotes($filter: TableNotesFilterInput, $limit: Int, $nextToken: String) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items { id name }
      nextToken
    }
  }
`;
const CREATE_NOTES = /* GraphQL */ `
  mutation CreateNotes($input: CreateNotesInput!) {
    createNotes(input: $input) { id name }
  }
`;
const DELETE_NOTES = /* GraphQL */ `
  mutation DeleteNotes($input: DeleteNotesInput!) {
    deleteNotes(input: $input) { id }
  }
`;

function NotesUi() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const nextTokenRef = useRef(null);

  async function fetchNotes(reset = false) {
    const { data } = await client.graphql({
      query: LIST_NOTES,
      variables: { limit: 50, nextToken: reset ? null : nextTokenRef.current },
      authMode: "userPool",
    });
    const page = data?.listNotes;
    nextTokenRef.current = page?.nextToken ?? null;
    setNotes(reset ? (page?.items ?? []) : [...notes, ...(page?.items ?? [])]);
  }

  async function addNote() {
    const name = form.name.trim();
    if (!name) return;
    await client.graphql({
      query: CREATE_NOTES,
      variables: { input: { name } },
      authMode: "userPool",
    });
    setForm({ name: "" });
    await fetchNotes(true);
  }

  async function removeNote(id) {
    await client.graphql({
      query: DELETE_NOTES,
      variables: { input: { id } },
      authMode: "userPool",
    });
    await fetchNotes(true);
  }

  useEffect(() => {
    // This component only mounts when the user is authenticated,
    // because it's rendered inside <Authenticator>’s authenticated slot.
    fetchNotes(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: 16 }}>
      <div style={{ display: "grid", gap: 8, marginTop: 24 }}>
        <input
          placeholder="New note name"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
        />
        <button onClick={addNote}>Create note</button>
      </div>

      <ul style={{ marginTop: 24 }}>
        {notes.map((n) => (
          <li key={n.id} style={{ marginBottom: 8 }}>
            {n.name} <button onClick={() => removeNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {nextTokenRef.current && (
        <button onClick={() => fetchNotes(false)} style={{ marginTop: 12 }}>
          Load more
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <div style={{ maxWidth: 720, margin: "1rem auto", padding: 16 }}>
            <h2>Welcome {user?.username}</h2>
          </div>
          <NotesUi />
          <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
            <button onClick={signOut} style={{ marginTop: 24 }}>
              Sign out
            </button>
          </div>
        </>
      )}
    </Authenticator>
  );
}
