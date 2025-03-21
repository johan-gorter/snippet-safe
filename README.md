# Snippet safe
Snippet safe allows users to store small programs in the cloud and retrieve them later. 
It was designed for students whose laptops are cleaned on every startup.

## Usecase
Each user is assigned a unique safe-id. 
When visiting the snippet safe website, the user is asked to enter the safe-id. 
When a safe with the given id is found, the user can retrieve the snippets stored in it. 
He can also add a new snippet to the safe. 
Saving a snippet is done by pressing a 'paste snippet from clipboard' button. 
Loading a snippet is done by pressing a 'copy snippet to clipboard' button. 
Snippets are shown in a list, sorted by the date they were added, with the most recent snippets first. 
Snippets can also be permanently deleted.

## Implementation
The website uses plain html, css and javascript, hosted in supabase. Server side is written using nodejs in plain javascript.
