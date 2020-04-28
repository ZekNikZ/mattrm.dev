let filters = {};
let projects = [];

$.getJSON("json/projects.json", data => {
    let buttonGroup = $(".filter-btn-group");

    for (let c of Object.keys(data.categories)) {
        filters[c] = true;

        let classString = "filter-btn";
        let title = data.categories[c];

        if (typeof data.categories[c] === "object") {
            title = data.categories[c].title;
            if (data.categories[c].unselected) {
                classString += " unselected";
                filters[c] = false;
            }
            if (data.categories[c].corner) {
                classString += " " + data.categories[c].corner;
            }
        }

        buttonGroup.append($("<button/>", {
            text: title,
            onclick: `toggleFilter("${c}")`,
            class: classString,
            id: "filter-" + c
        }));
    }
    filters["unfinished"] = false;

    let idCounter = 0;
    data.projects.sort((a, b) => a.name.localeCompare(b.name))
    for (let p of data.projects) { 
        let obj = $("<div/>", {
            class: "project" + (p.image ? " project-has-image" : "")
        });

        // Image
        if (p.image) {
            obj.append($("<img/>", {
                class: "project-image",
                src: p.image
            }));
        }

        // Start Content
        let content = $("<div/>", {
            class: "project-content"
        });

        // Title
        content.append($("<h3/>", {
            class: "project-title",
            html: p.name
        }));

        // Description
        content.append($("<p/>", {
            class: "project-description",
            html: p.description
        }));

        // Remark
        if (p.remark) {
            content.append($("<p/>", {
                class: "project-remark",
                text: p.remark
            }));
        }

        // Remark
        if (p.categories.includes("unfinished")) {
            content.append($("<p/>", {
                class: "project-remark-unfinished",
                html: "Note: This project is unfinished. Proceed with caution."
            }));
        }

        // Links
        if (p.links) {
            let links = $("<div/>", {
                class: "project-links"
            });

            for (let l of Object.keys(p.links)) {
                switch (l) {
                    case "github":
                        links.append($("<a/>", {
                            class: "project-link link-github",
                            href: p.links[l],
                            text: "GitHub"
                        }));
                        break;
                    case "steam":
                        links.append($("<a/>", {
                            class: "project-link link-steam",
                            href: p.links[l],
                            text: "Steam Workshop"
                        }));
                        break;
                    default:
                        links.append($("<a/>", {
                            class: "project-link",
                            href: p.links[l],
                            text: l
                        }));
                        break;
                }
            }

            content.append(links);
        }

        // End Content
        obj.append(content);

        projects.push({
            id: idCounter++,
            categories: p.categories,
            obj: obj
        });

        $(".project-group").append(obj);
    }
});

function toggleFilter(category) {
    if (filters[category]) {
        $(`#filter-${category}`).addClass("unselected");
    } else {
        $(`#filter-${category}`).removeClass("unselected");
    }
    filters[category] = !filters[category];

    updateFilters();
}

function updateFilters() {
    for (let p of projects) {
        if (p.categories.some(c => filters[c])) {
            p.obj.show();
        } else {
            p.obj.hide();
        }
    }
}