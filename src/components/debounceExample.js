//  const getMovies = useMemo(
//     () =>
//       debounce(async function (selected) {
//         dispatch({ type: "fetchComplete", value: null })
//         try {
//           const response = await Axios.get(`${state.baseUrl + selected}`);
//           dispatch({ type: "fetchComplete", value: response.data.results })
//         } catch (e) {
//           console.log("There was a problem ww.");
//           dispatch({ type: "fetchComplete", value: null })
//         }
//       }, 200)

//     , [state.baseUrl, dispatch]);