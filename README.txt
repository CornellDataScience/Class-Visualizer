CLASS-VISUALIZER.IPYNB
- CODE FOR SCRAPING FROM ROSTER
- MERGING CLEANED MEDIAN DATA INTO SCRAPED ROSTER DATA
classes_from_roster.csv
- raw data
Classes_With_Medians 
- output of class-visualizer.ipynb (cleaned median with scraped roster data)
Cleaned_Medians.csv 
- cleaned median data
Cornell_Median_Grades.csv
- raw median data
precoMergeRMP.ipynb 
- makeing preco columns and merging with RMP data
Full_Data.csv
- everything we previously had (2/24), RMP, medians, roster
FullerData_CUReviews.csv
- everything we have to date (3/23), RMP, medians, roster, CU Reviews
Reddit Scraping.ipynb 
- Code for scraping relevant reddit posts
CU_Reviews_Scraping.ipynb
- Code for scraping from CU Reviews
investigation.ipynb
- code for figuring out whats up with the missing classes. Updated Class-Visualizer.ipynb to handle almost all missing cases. 

WHEN WE UPDATE FOR NEW SEMESTER
1) Download updated median grade spreadsheet and replace with Cornell_Median_Grades.csv 
2) Re-run RMP_Scraping notebook and save as RMP.csv
3) Class-Visualizer.ipynb: Change "Roster ="SP-22" and run whole notebook
4) precoMergeRMP: Update semesterdict so most current semester is 0, update any lines with "SP-22" or similar, export df as Full_Data.csv
5) Re-run CU_Reviews_Scraping and safe df as FullerData_CUReviews.csv