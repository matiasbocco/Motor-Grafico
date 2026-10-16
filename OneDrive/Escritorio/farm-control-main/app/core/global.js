import { create } from "zustand";
import secure from "./secure";
import utils from "./utils";
import api from "./api";
import { ADDRESS } from "./api";

const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

const partition = (arr, low, high) => {
  const pivot = arr[high].shed;
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j].shed <= pivot) {
      i++;
      swap(arr, i, j);
    }
  }

  swap(arr, i + 1, high);
  return i + 1;
};

const quickSort = (arr, low, high) => {
  if (low < high) {
    const pi = partition(arr, low, high);

    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
};

const sortDataByShed = (data) => {
  const arr = [...data];
  const n = arr.length;
  quickSort(arr, 0, n - 1);
  return arr;
};

const useGlobal = create((set, get) => ({
  //------------------
  //  Inicialization
  //------------------

  initialized: false,

  init: async () => {
    const credentials = await secure.get("credentials");
    if (credentials) {
      try {
        const response = await api({
          method: "POST",
          url: "/user/signin/",
          data: {
            username: credentials.username,
            password: credentials.password,
          },
        });

        if (response.status !== 200) {
          throw "Authentication error";
        }

        const user = response.data.user;
        const tokens = response.data.tokens;

        console.log(tokens.access);

        secure.set("tokens", tokens);

        //console.log(tokens.access)

        set((state) => ({
          user: user,
          tokens: tokens,
          admin: user.rank == 0 ? true : false,
          farmer: user.rank == 1 ? true : false,
          trucker: user.rank == 2 ? true : false,
          producer: user.rank == 3 ? true : false,
          slaughterTrucker: user.rank == 4 ? true : false,
          replacement: user.rank == 5 ? true : false,
          initialized: true,
          authenticated: true,
        }));

        return;
      } catch (error) {
        console.log("useGlobal.init:", error);
      }
    }
    set((state) => ({
      initialized: true,
    }));
  },

  //------------------
  //  Authentication
  //------------------

  authenticated: false,
  user: {},
  tokens: {},
  admin: false,
  farmer: false,
  producer: false,
  trucker: false,
  slaughterTrucker: false,
  replacement: false,

  login: (credentials, user, tokens) => {
    secure.set("credentials", credentials);
    secure.set("tokens", tokens);
    set((state) => ({
      authenticated: true,
      user: user,
      tokens: tokens,
      admin: user.rank == 0 ? true : false,
      farmer: user.rank == 1 ? true : false,
      trucker: user.rank == 2 ? true : false,
      producer: user.rank == 3 ? true : false,
      slaughterTrucker: user.rank == 4 ? true : false,
      replacement: user.rank == 5 ? true : false,
    }));
  },

  logout: () => {
    secure.remove("credentials");
    secure.remove("tokens");
    set((state) => ({
      authenticated: false,
      user: {},
      admin: false,
      farmer: false,
      producer: false,
      trucker: false,
      slaughterTrucker: false,
      replacement: false,
    }));
  },

  signup: async (username, password, name, lastName, rank, farm) => {
    const tokens = get().tokens;
    const user = get().user;
    try {
      const response = await api({
        method: "POST",
        url: "/user/signup/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          username: username,
          password: password,
          first_name: name,
          last_name: lastName,
          rank: rank.toString(),
          farm: farm,
          creator: user.username,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      if (error == "Request failed with status code 409") {
        set((state) => ({
          response: {
            title: "Error",
            message: "Usuario ya existe",
            status: "error",
          },
        }));
      }
    }
  },

  //------------------
  //  Initialization
  //------------------

  farmData: [],
  getFarmerData: async () => {
    const user = get().user;
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/farmer-data/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: user.farm,
        },
      });
      const data = sortDataByShed(response.data);
      set((state) => ({
        farmData: data,
      }));
    } catch (error) {
      console.log("getFarmData:", error);
    }
  },

  sendGroup: async (shedNumber, quantity, cabin, geneticLine, sex) => {
    const user = get().user;
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/new-group/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          shed: { farm: user.farm, number: shedNumber },
          quantity: quantity,
          cabin: cabin,
          genetic_line: geneticLine,
          sex: sex,
        },
      });
      const data = get().farmData;
      if (response.data.status == "success") {
        set((state) => ({
          farmData: [...data, response.data.group],
        }));
      }
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      console.log("sendExpoToken:", error);
    }
  },

  //------------------
  //  Notifications
  //------------------

  sendExpoToken: async (pushToken) => {
    const user = get().user;
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/user/push-token/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          username: user.username,
          token: pushToken,
        },
      });
    } catch (error) {
      console.log("sendExpoToken:", error);
    }
  },

  setFarmerNotification: async (day) => {
    const user = get().user;
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/set-notification/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          username: user.username,
          group_day: day,
        },
      });
    } catch (error) {
      console.log("setFarmerNotification:", error);
    }
  },

  //------------------
  //  Send Data
  //------------------

  sendWeekData: async (weight, mortality, day, id) => {
    const tokens = get().tokens;
    const data = get().farmData;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/send-week-data/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          weight: weight,
          mortality: mortality,
          day: day,
          group_id: id,
        },
      });
      data.forEach((group) => {
        if (group.group_id == id) {
          group.updated = true;
        }
      });
      set((state) => ({
        farmData: data,
      }));
      return response.data;
    } catch (error) {
      console.log("sendWeekData:", error);
    }
  },

  //------------------
  //  Farm Admin
  //------------------

  currentFarm: "",
  setCurrentFarm: (value) => set({ currentFarm: value }),

  farmAdminData: [],
  setFarmAdminData: (value) => set({ farmAdminData: value }),

  getFarmData: async () => {
    const farm = get().currentFarm;
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-farm-data/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      });
      const data = sortDataByShed(response.data);
      set((state) => ({
        farmAdminData: data,
      }));
    } catch (error) {
      console.log("getFarmData:", error);
    }
  },

  sheds: [],
  getSheds: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "GET",
        url: "/farm/sheds/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      set((state) => ({
        sheds: response.data,
      }));
    } catch (error) {
      console.log("getSheds:", error);
    }
  },

  allFarmsData: [],
  getAllFarmsData: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/all-farms-data/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      set((state) => ({
        allFarmsData: response.data,
      }));
    } catch (error) {
      console.log("getFullFarmData:", error);
    }
  },

  getFarmUsers: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/user/get-farmers/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getFarmUsers:", error);
    }
  },

  getProducers: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/user/get-producers/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getProducers:", error);
    }
  },

  getTruckers: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/user/get-truckers/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getTruckers:", error);
    }
  },

  response: "",
  wipeResponse: () => {
    set((state) => ({
      response: "",
    }));
  },

  sendFoodProduction: async (food_type, quantity, producer, trucker) => {
    const tokens = get().tokens;
    if (quantity.includes(",")) {
      quantity = quantity.replace(",", ".");
    }
    try {
      const response = await api({
        method: "POST",
        url: "/farm/food-production/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          food_type: food_type,
          quantity: quantity,
          producer: producer,
          trucker: trucker,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      console.log("sendFoodProduction:", error);
    }
  },

  sendFoodRecall: async (food_type, quantity, remit_number) => {
    const tokens = get().tokens;
    if (quantity.includes(",")) {
      quantity = quantity.replace(",", ".");
    }
    try {
      const response = await api({
        method: "POST",
        url: "/farm/food-recall/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          food_type: food_type,
          quantity: quantity,
          remit_number: remit_number,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  sendFoodDelivery: async (
    farm,
    receiver,
    food_type,
    quantity,
    remit_number
  ) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/food-delivery/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
          receiver: receiver,
          food_type: food_type,
          quantity: quantity,
          remit_number: remit_number,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  sendFoodReceipt: async (food_type, quantity, trucker, remit_number) => {
    const tokens = get().tokens;
    const user = get().user;
    if (quantity.includes(",")) {
      quantity = quantity.replace(",", ".");
    }
    try {
      const response = await api({
        method: "POST",
        url: "/farm/food-receipt/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: user.farm,
          food_type: food_type,
          quantity: quantity,
          provider: trucker,
          remit_number: remit_number,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  getFarms: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "GET",
        url: "/farm/farms/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getFarms:", error);
    }
  },

  getTableData: async (id) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/table-data/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          id: id,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getTableData:", error);
    }
  },

  notifications: [],

  getNotifications: async () => {
    const tokens = get().tokens;
    const user = get().user;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/farm-notifications/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: user.farm,
        },
      });
      set((state) => ({
        notifications: response.data,
      }));
      return response.data;
    } catch (error) {
      console.log("getNotifications:", error);
    }
  },

  getProduction: async () => {
    const tokens = get().tokens;
    const user = get().user;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-food-production/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          trucker: user.username,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getProduction:", error);
    }
  },

  getRecall: async () => {
    const tokens = get().tokens;
    const user = get().user;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-food-recall/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          trucker: user.username,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getProduction:", error);
    }
  },

  getDelivery: async () => {
    const tokens = get().tokens;
    const user = get().user;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-food-delivery/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farmer: user.username,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getProduction:", error);
    }
  },

  remitData: [],
  setRemitData: (value) => set({ remitData: value }),

  truckRefresh: false,

  refreshTruckScreen: () => {
    set((state) => ({
      truckRefresh: !state.truckRefresh,
    }));
  },

  rejectProduction: async (remit_number, reason, producer) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/reject-production/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          remit_number: remit_number,
          reason: reason,
          producer: producer,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getProduction:", error);
    }
  },

  farmRefresh: false,

  refreshFarmScreen: () => {
    set((state) => ({
      farmRefresh: !state.farmRefresh,
    }));
  },

  modalVisible: false,

  showModal: () => {
    set((state) => ({
      modalVisible: true,
    }));
  },

  closeModal: () => {
    set((state) => ({
      modalVisible: false,
    }));
  },

  sendSlaughter: async (farm, shed, quantity, tare, gross_weight, truck, client) => {
    const tokens = get().tokens;
    const user = get().user;
    if (quantity.includes(",")) {
      quantity = quantity.replace(",", ".");
    }
    try {
      const response = await api({
        method: "POST",
        url: "/farm/slaughter/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
          shed: shed,
          quantity: quantity,
          tare: tare,
          gross_weight: gross_weight,
          truck: truck,
          trucker: user.username,
          client: client,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  sendGas: async (quantity) => {
    const tokens = get().tokens;
    const user = get().user;
    if (quantity.includes(",")) {
      quantity = quantity.replace(",", ".");
    }
    try {
      const response = await api({
        method: "POST",
        url: "/farm/gas-income/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          gas: quantity,
          farm: user.farm,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  food: [],

  getFood: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-food/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      set((state) => ({
        food: response.data,
      }));
    } catch (error) {
      console.log("getFood:", error);
    }
  },

  farmFood: [],

  getFarmFood: async () => {
    const tokens = get().tokens;
    const farm = get().currentFarm;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-farm-food/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      });
      set((state) => ({
        farmFood: response.data,
      }));
    } catch (error) {
      console.log("getFarmFood:", error);
    }
  },

  income: null,
  setIncome: (value) => set({ income: value }),

  startBatch: async (farm) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/batch-init/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  batches: [],
  getActiveBatches: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-active-batches/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      set((state) => ({
        batches: response.data,
      }));
    } catch (error) {
      console.log("getActiveBatches:", error);
    }
  },

  batchModal: false,
  setBatchModal: (value) => set({ batchModal: value }),

  adminRefresh: false,

  refreshAdminScreen: () => {
    set((state) => ({
      adminRefresh: !state.adminRefresh,
    }));
  },

  batch: null,
  setBatch: (batch) => {
    set((state) => ({
      batch: batch,
    }));
  },
  clearBatch: () => {
    set((state) => ({
      batch: null,
    }));
  },

  deleteBatch: async (farm) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/delete-batch/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  finishBatch: async (farm) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/finish-batch/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },
  
  getSlaughters: async (farm) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-slaughters/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      });
      return response.data;
    } catch (error) {
      console.log("getSlaughters:", error);
    }
  },

  newFarm: async (farm) => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/new-farm/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      });
      set((state) => ({
        response: response.data,
      }));
    } catch (error) {
      set((state) => ({
        response: {
          title: "Error",
          message: "Error al enviar los datos",
          status: "error",
        },
      }));
    }
  },

  farms: [],
  
  getAdminFarms: async () => {
    const tokens = get().tokens;
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-farms/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      });
      set((state) => ({
        farms: response.data,
      }));
      console.log(response.data)
    } catch (error) {
      console.log("getAdminFarms:", error);
    }
  },

  getFarmSheds: async (farm) => {
    const tokens = get().tokens
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-farm-sheds/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: farm,
        },
      })
      const data = response.data.sort((a, b) => a.number - b.number);
      return data
    } catch (error) {
      console.log("getFarmSheds:", error);
    }
  },

  editShedArea: async (number, farm, area) => {
    const tokens = get().tokens
    try {
      const response = await api({
        method: "POST",
        url: "/farm/edit-shed-area/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          number: number,
          farm: farm,
          area: area,
        },
      })
      return response.data
    } catch (error) {
      console.log("editShedArea:", error);
    }
  },

  newShed: async (number, farm, area) => {
    const tokens = get().tokens
    try {
      const response = await api({
        method: "POST",
        url: "/farm/new-shed/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          number: number,
          farm: farm,
          area: area,
        },
      })
      return response.data
    } catch (error) {
      console.log("newShed:", error);
    }
  },

  deleteShed: async (farm, number) => {
    const tokens = get().tokens
    try {
      const response = await api({
        method: "POST",
        url: "/farm/delete-shed/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          number: number,
          farm: farm,
        },
      })
      return response.data
    } catch (error) {
      console.log("deleteShed:", error);
    }
  },

  getStatistics: async () => {
    const tokens = get().tokens
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-statistics/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      })
      set((state) => ({
        statistics: response.data,
      }))
      console.log(response.data)
    } catch (error) {
      console.log("getStatistics:", error);
    }
  },
  selectedGraph: "farms",
  setSelectedGraph: (value) => set({ selectedGraph: value }),

  statistics: [],

  farmerGetTasks: async () => {
    const tokens = get().tokens
    const user = get().user
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-farmer-tasks/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          farm: user.farm,
        },
      })
      return response.data
    } catch (error) {
      console.log("farmerGetTasks:", error);
    }
  },

  getAllTasks: async () => {
    const tokens = get().tokens
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-all-tasks/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      })
      console.log(response.data)
      return response.data
    } catch (error) {
      console.log("getAllTasks:", error);
    }
  },

  sendTask: async (title, description, farm) => {
    const tokens = get().tokens
    const user = get().user
    try {
      const response = await api({
        method: "POST",
        url: "/farm/send-task/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          title: title,
          description: description,
          farm: farm,
          assigner: user.username,
        },
      })
      return response.data
    } catch (error) {
      console.log("sendTask:", error);
    }
  },

  setTaskDone: async (id) => {
    const tokens = get().tokens
    const user = get().user
    try {
      const response = await api({
        method: "POST",
        url: "/farm/set-task-done/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          id: id,
          responsible: user.username,
        },
      })
      return response.data
    } catch (error) {
      console.log("setTaskDone:", error);
    }
  },

  getLastSlaughters: async () => {
    const tokens = get().tokens
    try {
      const response = await api({
        method: "POST",
        url: "/farm/get-last-slaughters/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
      })
      return response.data
    } catch (error) {
      console.log("getLastSlaughters:", error);
    }
  },

  sendManualFood: async (food_type, quantity) => {
    const tokens = get().tokens
    const user = get().user
    if (quantity.includes(",")) {
      quantity = quantity.replace(",", ".")
    }
    try {
      const response = await api({
        method: "POST",
        url: "/farm/manual-food/",
        headers: {
          Authorization: "Bearer " + tokens.access,
        },
        data: {
          food_type: food_type,
          quantity: quantity,
          farm: user.farm,
          user: user.username
        },
      })
      return response.data
    } catch (error) {
      console.log("sendManualFood:", error);
    }
  },
}));

export default useGlobal;
