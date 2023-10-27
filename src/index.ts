const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main-container") as HTMLElement;


// define contract of an object

interface UserData {
    login: string;
    id: number;
    avatar_url: string;
    location: string;
    url: string;
}

// reusable function 
async function myCustomfetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        `Network response was not ok - status ${response.status}`;
    }
    const data = await response.json();
    //console.log(data);
    return data;
}

// display the card UI
const showResultUI = (singleUser: UserData) => {
    const { login, avatar_url, url } = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `
        <div class="card">
        <img src="${avatar_url}" alt = "${login}"/>
        <div class="card-footer">
        <p>${login}</p>
        <a href="${url}" target="_blank">Github</a>
        </div>
        </div>
        `
    )
};
// default function call
function fetchUserData(url: string) {
    myCustomfetcher<UserData[]>(url, {}).then((userInfo) => {
        for (const singleUser of userInfo) {
            showResultUI(singleUser);
        }
    });
}
fetchUserData("https://api.github.com/users");

// perform search function
formSubmit.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const searchTerm = getUsername.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUsers = await myCustomfetcher<UserData[]>(url, {});
        const matchingUsers = allUsers.filter((user)=>{
            return user.login.toLowerCase().includes(searchTerm);
        });
    // need to clear prev data
    main_container.innerHTML = "";
    
    if(matchingUsers.length === 0){
        main_container?.insertAdjacentHTML(
            "beforeend",
            `
            <h4 class="empty-msg">Matching users not found</h4>
            `
        );
    }
    else{
        for (const singleUser of matchingUsers) {
            showResultUI(singleUser);
        }
    }
    } catch (error) {
        console.log(error);
    }
});