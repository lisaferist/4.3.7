const reposList = document.querySelector('.repos-list');
const searchBar = document.querySelector('.search-bar');
const searchingRepos = document.querySelectorAll('.searching-repos__searching-repo');
const searchingReposList = document.querySelector('.searching-repos');
let reposArray = [];
const debounce = (fn, debounceTime) => {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime);
    };
};
function createReposFragment(reposData) {
    const foundRepo = document.createElement('li');
    foundRepo.classList.add('repos-list__found-repo', 'found-repo');

    const reposInfo = document.createElement('div');
    reposInfo.classList.add('found-repo__repos-info');

    const reposName = document.createElement('p');
    reposName.classList.add('found-repo__text');
    reposName.textContent = `Name: ${reposData.name}`;
    const reposOwner = document.createElement('p');
    reposOwner.classList.add('found-repo__text');
    reposOwner.textContent = `Owner: ${reposData.owner}`;
    const reposStars = document.createElement('p');
    reposStars.classList.add('found-repo__text');
    reposStars.textContent = `Stars: ${reposData.stars}`;

    const xButton = document.createElement('button');
    xButton.classList.add('found-repo__x-button');
    xButton.textContent = 'delete';
    xButton.addEventListener('click', (e) => {
        foundRepo.remove();
    })

    reposInfo.appendChild(reposName);
    reposInfo.appendChild(reposOwner);
    reposInfo.appendChild(reposStars);
    foundRepo.appendChild(reposInfo);
    foundRepo.appendChild(xButton);

    reposList.appendChild(foundRepo);

    return foundRepo;
}
function search(e) {
    const searchQuery = e.target.value;
    if (searchQuery) {
        fetch(`https://api.github.com/search/repositories?q=${searchQuery}`).then(response =>
            response.json()
        ).then(obj => {
            reposArray = obj.items.slice(0, 5);
            for (let i = 0; i < reposArray.length; i++) {
                const repo = reposArray[i];
                searchingRepos[i].textContent = repo.name;
            }
            searchingReposList.classList.remove('searching-repos--invisible');
        })
    } else {
        searchingReposList.classList.add('searching-repos--invisible');
    }
}
function addRepo(e) {
    const reposDataObj = {
        name: '',
        owner: '',
        stars: 0
    }
    searchBar.value = null;
    searchingReposList.classList.add('searching-repos--invisible')
    const repository = reposArray[e.target.id - 1];
    reposDataObj.name = repository.name;
    reposDataObj.owner = repository.owner.login;
    reposDataObj.stars = repository.stargazers_count;
    createReposFragment(reposDataObj);
}

const debouncedSearch = debounce(search, 300);
searchBar.addEventListener('input', debouncedSearch);
for (let searchingRepo of searchingRepos) {
    searchingRepo.addEventListener('click', addRepo);
}