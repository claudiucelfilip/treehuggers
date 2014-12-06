<?php

class DB {

	private $dbHandler;
	private $query; 

	// Database config items
	const DBUSER = 'root';
	const DBPASS = 'treehuggers';
	const DBNAME = 'treehuggers';
	const DBHOST = 'localhost';

	const MAXPLAYERS = 4;

	// Construct 
	public function __construct() {
		try {
			$this->dbHandler = new PDO('mysql:host=' . DB::DBHOST . ';dbname=' . DB::DBNAME, DB::DBUSER, DB::DBPASS);
		} catch (PDOException $e) {
    	print "Error!: " . $e->getMessage() . "<br/>";
    	die();
		}
	}	

	############## GENERAL METHODS ##############

	// get all items from table method
	public function getAll($table = '') {
		$this->query = "SELECT * FROM " . $table;

		return $this->dbHandler->query($this->query)->fetchAll();

	}

	// get all items from table method
	public function getById($table = '', $id = 0) {
		$this->query = "SELECT * FROM `" . $table . "` WHERE `id` = " . $id;
		
		return $this->dbHandler->query($this->query)->fetch(PDO::FETCH_ASSOC);
		
	}	

	// insert method
	public function create($params = array()) {
		extract($params);

		$keys = array_keys($fields);

		$this->query = 'INSERT INTO `' . $table . '` '
     . '(' . implode(', ', $keys) . ') '
     . "VALUES ('".implode("', '", $fields)."')";    

    $result = $this->dbHandler->query($this->query);

    // throw error
    if (!$result) {
    	$error = $this->dbHandler->errorInfo();

    	return array(
    		'errorMessage' => $error[2],
    		'status'       => 666
  		);
    }

    $lastInsert = $this->dbHandler->lastInsertId();

    if ($lastInsert) {
    	$fields['id'] = $lastInsert;	
    }
    
    return $fields;
	}


	// update method
	public function update($params = array()) {
		extract($params);

		$this->query = 'UPDATE `' . $table . '` SET ';

		foreach ($fields as $key => $field) {
			$this->query .= '' . $key . ' = "' . $field .'", ';			
		}

		$this->query = substr($this->query, 0, -2);

		$this->query .= " WHERE `id` = " . $fields['id'];
		
		$result = $this->dbHandler->query($this->query);

		// throw error
    if (!$result) {
    	$error = $this->dbHandler->errorInfo();

    	return array(
    		'errorMessage' => $error[2],
    		'status'       => 666
  		);
    }    

    return $fields; 
	}

	// delete method
	public function remove($params = array()) {
		extract($params); 

		$this->query = 'DELETE FROM `' . $table . '` WHERE `id` = ' . $fields['id'];

		$result = $this->dbHandler->query($this->query);

		// throw error
    if (!$result) {
    	$error = $this->dbHandler->errorInfo();

    	return array(
    		'errorMessage' => $error[2],
    		'status'       => 666
  		);
    }    

    return array(
    	'status' =>'200'
    );
  }

  ############## INTERNAL METHODS ##############

  // get islands that are not filled
  public function getAssignableIsland() {

  	$this->query = "SELECT * FROM `islands` WHERE `players` < " . DB::MAXPLAYERS . " ORDER BY players ASC LIMIT 1";
  	$result = $this->dbHandler->query($this->query);

  	return $result->fetch(PDO::FETCH_ASSOC);
  }
}






















