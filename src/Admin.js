import {
  Admin,
  Resource,
  List,
  Edit,
  SimpleForm,
  TextInput,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  ImageField,
  SelectInput,
  useRecordContext,
} from "react-admin";
import customDataProvider from "./customDataProvider";
import authProvider from "./authProvider";

// 🚀 Users List Component
const UsersList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <TextField source="email" />
      <TextField source="phone" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// ✏️ Edit Users
const UsersEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="email" />
      <TextInput source="phone" />
    </SimpleForm>
  </Edit>
);

// 🏷️ Custom Field for Status
const StatusField = (props) => {
  const record = useRecordContext(props);
  if (!record) return null; // ✅ Avoid errors if no data

  const statusColors = {
    available: "green",
    sold: "red",
    pending: "orange",
  };

  return (
    <span
      style={{
        backgroundColor: statusColors[record.status] || "gray",
        color: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        fontWeight: "bold",
      }}
    >
      {record.status}
    </span>
  );
};

// 🚗 Cars List Component
const CarsList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ImageField source="imageURL" title="Car Image" />
      <TextField source="make" />
      <TextField source="model" />
      <TextField source="year" />
      <TextField source="priceUSD" />
      <StatusField source="status" /> {/* ✅ Status with color badge */}
      <EditButton /> {/* ✅ Only status will be editable in edit form */}
      <DeleteButton />
    </Datagrid>
  </List>
);

// ✏️ Edit Cars
const CarsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextField source="id" disabled />
      <TextField source="make" disabled />
      <TextField source="model" disabled />
      <TextField source="year" disabled />
      <TextField source="priceUSD" disabled />
      <ImageField source="imageURL" title="Car Image" /> {/* 🖼️ Show image */}
      <SelectInput
        source="status"
        label="Car Status"
        choices={[
          { id: "available", name: "✅ Available" },
          { id: "sold", name: "❌ Sold" },
          { id: "pending", name: "⏳ Pending" },
        ]}
      />
    </SimpleForm>
  </Edit>
);

const AdminPanel = () => (
  <Admin dataProvider={customDataProvider} authProvider={authProvider}>
    <Resource name="users" list={UsersList} edit={UsersEdit} />
    <Resource name="cars" list={CarsList} edit={CarsEdit} />
  </Admin>
);

export default AdminPanel;
