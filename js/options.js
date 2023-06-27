// Saves options to chrome.storage
function save_options() {
  const api_key = document.getElementById("api-key").value;
  const database_id = document.getElementById("database-id").value;
  const name = document.getElementById("name").checked;
  const contest = document.getElementById("contest").checked;
  const difficulty = document.getElementById("difficulty").checked;
  const url = document.getElementById("url").checked;

  chrome.storage.local.set(
    {
      ATCODERTONOTION_API_TOKEN: api_key,
      ATCODERTONOTION_DATABASE_ID: database_id,
      ATCODERTONOTION_NAME_CHEKED: name,
      ATCODERTONOTION_CONTEST_CHEKED: contest,
      ATCODERTONOTION_DIFFICULTY_CHEKED: difficulty,
      ATCODERTONOTION_URL_CHEKED: url,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "　";
      }, 2000);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get(
    [
      "ATCODERTONOTION_API_TOKEN",
      "ATCODERTONOTION_DATABASE_ID",
      "ATCODERTONOTION_NAME_CHEKED",
      "ATCODERTONOTION_CONTEST_CHEKED",
      "ATCODERTONOTION_DIFFICULTY_CHEKED",
      "ATCODERTONOTION_URL_CHEKED",
    ],
    function (items) {
      document.getElementById("api-key").value =
        items.ATCODERTONOTION_API_TOKEN;
      document.getElementById("database-id").value =
        items.ATCODERTONOTION_DATABASE_ID;
      document.getElementById("name").checked =
        items.ATCODERTONOTION_NAME_CHEKED;
      document.getElementById("contest").checked =
        items.ATCODERTONOTION_CONTEST_CHEKED;
      document.getElementById("difficulty").checked =
        items.ATCODERTONOTION_DIFFICULTY_CHEKED;
      document.getElementById("url").checked = items.ATCODERTONOTION_URL_CHEKED;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
