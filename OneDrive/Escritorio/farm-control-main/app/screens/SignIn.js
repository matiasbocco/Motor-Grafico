import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useState } from "react";
import api from "../core/api";
import utils from "../core/utils";
import useGlobal from "../core/global";

const Input = ({ title, value, setValue, error, setError, password }) => {
  return (
    <View>
      <Text style={[styles.text, { color: error ? "#ff5555" : "#70747a" }]}>
        {error ? error : title}
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: error ? "#ff5555" : "transparent" },
        ]}
        secureTextEntry={password}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          if (error) {
            setError("");
          }
        }}
      />
    </View>
  );
};

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // Estado para manejar el mensaje de error
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = useGlobal((state) => state.login);

  const onSignIn = () => {
    // check username
    const failUsername = !username;
    if (failUsername) {
      setUsernameError("No ingresó el nombre de usuario");
    }

    // check password
    const failPassword = !password;
    if (failPassword) {
      setPasswordError("No ingresó la contraseña");
    }

    if (failUsername || failPassword) {
      return;
    }

    // sign in request
    api({
      method: "POST",
      url: "/user/signin/",
      data: {
        username: username,
        password: password,
      },
    })
      .then((response) => {
        const credentials = {
          username: username,
          password: password,
        };
        login(credentials, response.data.user, response.data.tokens);
      })
      .catch((error) => {
        if (error.response) {
          // Mostrar el mensaje de error y ocultarlo después de 2 segundos
          setErrorMessage("Usuario o contraseña incorrecta");
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 3500);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  };

  return (
    <ScrollView style={{ flexGrow: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>POLLOS DEL CAMPO</Text>

          <Input
            title={"Usuario"}
            value={username}
            error={usernameError}
            setValue={setUsername}
            setError={setUsernameError}
            password={false}
          />
          <Input
            title={"Contraseña"}
            value={password}
            error={passwordError}
            setValue={setPassword}
            setError={setPasswordError}
            password={true}
          />

          <Button title={"Iniciar Sesión"} onPress={onSignIn} />

          {/* Mostrar el mensaje de error si showError es verdadero */}
          {showError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 200,
  },
  title: {
    color: "#202020",
    fontSize: 36,
    textAlign: "center",
    fontFamily: "BowlbyOneSC_400Regular",
  },
  text: {
    marginVertical: 6,
    paddingLeft: 16,
  },
  input: {
    backgroundColor: "#e1e2e4",
    borderRadius: 26,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#202020",
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff5555",
    borderRadius: 10,
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
});
